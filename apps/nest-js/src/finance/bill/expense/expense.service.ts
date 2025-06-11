import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { filterByCommonKeys } from '@repo/services/array/array';

import ExpenseBusiness from '@repo/business/finance/expense/business/business';
import ExpenseConstructor from '@repo/business/finance/expense/expense';
import type { ExpenseEntity } from '@repo/business/finance/expense/types';

import { FilterParams, Service } from '../../../shared';

import { Bill } from '../../entities/bill.entity';
import { Expense } from '../../entities/expense.entity';
import type { FinanceSeederParams } from '../../types';
import { Supplier } from '../../entities/supplier.entity';
import { SupplierService } from '../../supplier/supplier.service';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

export type InitializeParams = {
    value?: number;
    type?: ExpenseEntity['type'];
    month?: ExpenseEntity['month'];
    expense: Expense;
    instalment_number?: number;
}

export type ExpenseSeederParams = Pick<FinanceSeederParams, 'expenseListJson' | 'billListJson'> & {
    bills: Array<Bill>;
    suppliers: Array<Supplier>;

}

@Injectable()
export class ExpenseService extends Service<Expense> {
    constructor(
        @InjectRepository(Expense)
        protected repository: Repository<Expense>,
        protected expenseBusiness: ExpenseBusiness,
        protected supplierService: SupplierService,
    ) {
        super('expenses', ['supplier', 'bill', 'children', 'parent'], repository);
    }

    get business(): ExpenseBusiness {
        return this.expenseBusiness;
    }

    async buildForCreation(bill: Bill, createExpenseDto: CreateExpenseDto) {
        const supplier = await this.supplierService.treatEntityParam<Supplier>(
            createExpenseDto.supplier,
            'Supplier',
        ) as Supplier;

        const parent = !createExpenseDto.parent
            ? undefined
            : await this.findOne({ value: createExpenseDto.parent, withRelations: true }) as Expense;

        return new ExpenseConstructor({
            supplier,
            bill,
            year: bill.year,
            type: createExpenseDto.type,
            paid: Boolean(createExpenseDto.paid),
            value: createExpenseDto.value,
            month: createExpenseDto.month,
            parent,
            description: createExpenseDto.description,
            is_aggregate: Boolean(parent),
            aggregate_name: !parent ? undefined : createExpenseDto.aggregate_name,
            instalment_number: createExpenseDto.instalment_number,
        });
    }

    async initialize({ type, expense, value = 0, month, instalment_number }: InitializeParams) {

        const expenseToInitialize = new ExpenseConstructor({
            ...expense,
            type: type ?? expense.type,
            instalment_number: instalment_number ?? expense.instalment_number,
        })

        await this.validateExistExpense(expenseToInitialize);

        const result = this.expenseBusiness.initialize(expenseToInitialize, value, month);
        const initializedExpense = await this.customSave(result.expenseForCurrentYear);

        if (initializedExpense) {
            result.expenseForCurrentYear = initializedExpense;
        }
        await this.validateParent(initializedExpense as Expense);
        return result;
    }

    async addExpenseForNextYear(bill: Bill, months: Array<string> = [], expense: Expense, existingExpense?: Expense) {
        const currentExpenseForNextYear = this.expenseBusiness.reinitialize(
            months,
            expense,
            existingExpense
        );
        const expenseCreated = await this.customSave({ ...currentExpenseForNextYear, bill });
        await this.validateParent(expenseCreated as Expense);
        return expenseCreated;
    }

    async customSave(expense: Expense) {
        const calculatedExpense = this.expenseBusiness.calculate(expense);
        return await this.save(calculatedExpense);
    }

    async buildForUpdate(expense: Expense, updateExpenseDto: UpdateExpenseDto) {
        const supplier = !updateExpenseDto?.supplier
            ? expense.supplier
            : await this.supplierService.treatEntityParam<Supplier>(
                updateExpenseDto.supplier,
                'Supplier',
            ) as Supplier;

        return new ExpenseConstructor({
            ...expense,
            ...updateExpenseDto,
            supplier
        });
    }

    async seeds({
                    bills,
                    suppliers,
                    billListJson,
                    expenseListJson,
                }: ExpenseSeederParams) {
        const seeds = this.seeder.currentSeeds<Expense>({ seedsJson: expenseListJson });
        console.log('# => seeds => ', seeds)
        const billListSeed = this.seeder.currentSeeds<Bill>({ seedsJson: billListJson });
        console.log('# => billListSeed => ', billListSeed)

        const financeBillExpenseListSeed = billListSeed.flatMap((bill) => bill.expenses ?? []);
        const financeExpenseListSeed = filterByCommonKeys<Expense>('id', seeds, financeBillExpenseListSeed);

        const currentSeeds = this.flattenParentsAndChildren(financeExpenseListSeed);

        const parents = currentSeeds.filter(item => !item.parent);
        const children = currentSeeds.filter(item => item.parent);

        const parentsSeeded = await this.seeder.entities({
            by: 'id',
            key: 'id',
            label: 'Expense',
            seeds: parents,
            createdEntityFn: async (item) => this.createdEntity(item, suppliers, bills)
        }) as Array<Expense>;

        const parentMap = new Map<string, Expense>(parentsSeeded.map(parent => [parent.id, parent]));

        const childrenPrepared = children.map(child => ({
            ...child,
            parent: parentMap.get(child?.parent?.id ?? '')
        }))

        return this.seeder.entities({
            by: 'id',
            key: 'id',
            label: 'Expense',
            seeds: childrenPrepared,
            withReturnSeed: true,
            createdEntityFn: async (item) => this.createdEntity(item, suppliers, bills)
        });
    }

    private createdEntity(expense: Expense, suppliers: Array<Supplier>, bills: Array<Bill>) {
        const supplier = this.seeder.getRelation<Supplier>({
            key: 'name',
            list: suppliers,
            relation: 'Supplier',
            param: expense?.supplier?.name,
        });

        const bill = bills.find((bill) => bill.id === expense.bill?.id) as Bill;

        return new ExpenseConstructor({
            ...expense,
            bill,
            supplier,
        })
    }

    private flattenParentsAndChildren(seeds: Array<Expense> = []) {
        return seeds.flatMap((item) => {
            if (!item.is_aggregate && Array.isArray(item?.children) && item.children.length > 0) {
                const childrenPrepared = item.children.map((child) => ({
                    ...child,
                    parent: item,
                }))
                return [
                    { ...item, children: undefined },
                    ...childrenPrepared
                ]
            }
            return item;
        })
    }

    private async validateParent(expense: Expense) {
        if (!expense?.parent) {
            return;
        }

        const parent = await this.findOne({ value: expense.parent.id, withRelations: true }) as Expense;

        if (!parent?.children?.length) {
            await this.customSave({
                ...parent,
                children: [expense],
            });
            return;
        }

        const existExpenseInChildren = parent.children.find((item) => item.id === expense.id);

        if (!existExpenseInChildren) {
            parent.children.push(expense);
            await this.customSave(parent)
        }
    }

    private async validateExistExpense(expense: Expense) {
        const filters: Array<FilterParams> = [
            {
                value: expense.name_code,
                param: 'expenses.name_code',
                relation: true,
                condition: 'LIKE',
            },
            {
                value: expense.year,
                param: 'expenses.year',
                relation: true,
                condition: '='
            }
        ];
        const result = await this.findAll({ withRelations: true, filters }) as Array<Expense>;

        if (result.length) {
            throw this.error(new ConflictException('Expense already exists'));
        }

    }
}
