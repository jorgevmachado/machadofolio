import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { filterByCommonKeys, Spreadsheet } from '@repo/services';

import { EExpenseType, Expense as ExpenseConstructor, ExpenseBusiness, type ExpenseEntity } from '@repo/business';

import { FilterParams, Service } from '../../../shared';

import { Bill } from '../../entities/bill.entity';
import { Expense } from '../../entities/expense.entity';
import type { FinanceSeederParams } from '../../types';
import { Supplier } from '../../entities/supplier.entity';
import { SupplierService } from '../../supplier/supplier.service';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { MonthService } from '../../month/month.service';
import { TMonth } from '@repo/services/date/month/month';

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

export type createToSheetParams = Record<string, string | number | boolean | object | Bill>;

@Injectable()
export class ExpenseService extends Service<Expense> {
    constructor(
        @InjectRepository(Expense)
        protected repository: Repository<Expense>,
        protected expenseBusiness: ExpenseBusiness,
        protected supplierService: SupplierService,
        protected monthService: MonthService
    ) {
        super('expenses', ['supplier', 'bill', 'months', 'children', 'parent'], repository);
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

        const result = this.expenseBusiness.initialize(expenseToInitialize, month);
        const initializedExpense = await this.customSave(result.expenseForCurrentYear, result.monthsForCurrentYear, value);

        if (initializedExpense) {
            result.expenseForCurrentYear = initializedExpense;
        }
        await this.validateParent(initializedExpense as Expense);
        return result;
    }

    async addExpenseForNextYear(bill: Bill, months: Array<TMonth> = [], expense: Expense, existingExpense?: Expense, value: number = 0) {
        const currentExpenseForNextYear = this.expenseBusiness.reinitialize(
            months,
            expense,
            existingExpense
        );
        const expenseCreated = await this.customSave({ ...currentExpenseForNextYear, bill }, months, value);
        await this.validateParent(expenseCreated as Expense);
        return expenseCreated;
    }

    async customSave(expense: Expense, months: Array<TMonth> = [], value: number = 0) {
        const currentExpenseCalculated = this.expenseBusiness.calculate(expense);
        const currentExpense = await this.save(currentExpenseCalculated);
        if (currentExpense && months.length > 0) {
            currentExpense.months = await this.monthService.createByRelationship({
                year: currentExpense.year,
                paid: currentExpense.paid,
                value,
                expense: currentExpense,
                listOfMonths: months,
                received_at: currentExpense.created_at
            });
            const expenseCalculated = this.expenseBusiness.calculate(currentExpense);
            return await this.customSave(expenseCalculated);
        }
        return currentExpense;
    }

    async buildForUpdate(expense: Expense, updateExpenseDto: UpdateExpenseDto) {
        const supplier = !updateExpenseDto?.supplier
            ? expense.supplier
            : await this.supplierService.treatEntityParam<Supplier>(
                updateExpenseDto.supplier,
                'Supplier',
            ) as Supplier;

        expense.type = !updateExpenseDto?.type ? expense.type : updateExpenseDto.type;
        expense.paid = updateExpenseDto.paid === undefined ? expense.paid : updateExpenseDto.paid;
        expense.description = !updateExpenseDto?.description ? expense.description : updateExpenseDto.description;
        const months = !updateExpenseDto?.months ? expense.months : await this.monthService.updateByRelationship({
            paid: expense.paid,
            expense,
            monthsToUpdate: updateExpenseDto.months
        });

        const currentExpense = new ExpenseConstructor({
            ...expense,
            months,
            supplier
        });

        return this.expenseBusiness.calculate(currentExpense);
    }

    async seeds({
                    bills,
                    suppliers,
                    billListJson,
                    expenseListJson,
                }: ExpenseSeederParams) {
        const seeds = this.seeder.currentSeeds<Expense>({ seedsJson: expenseListJson });
        const billListSeed = this.seeder.currentSeeds<Bill>({ seedsJson: billListJson });

        const financeBillExpenseListSeed = billListSeed.flatMap((bill) => bill?.expenses ?? []);
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

    private buildExpenseToSheet(params: createToSheetParams) {
        const year = Number(params['year']);
        const bill = params['bill'] as Bill;
        const supplierName = params['supplier']?.toString() || '';
        const is_aggregate = Boolean(params['is_aggregate']) || false;
        const aggregate_name = params['aggregate_name']?.toString();

        const name = !is_aggregate
            ? `${bill.name} ${supplierName}`
            : `${bill.name} ${aggregate_name} ${supplierName}`;

        const childrenParams = params?.['children'];
        const children = Array.isArray(childrenParams) && childrenParams.length
            ? childrenParams
            : undefined

        const type = params['type'] as EExpenseType ?? EExpenseType.VARIABLE;

        return {
            year,
            bill,
            name,
            type,
            children,
            description: 'Generated by a spreadsheet.',
            supplierName,
            is_aggregate,
            aggregate_name
        }
    }

    private async createToSheet(params: createToSheetParams) {

        const builtExpense = this.buildExpenseToSheet(params);

        const item = await this.findOne({
            value: builtExpense.name,
            filters: [{
                value: builtExpense.year,
                param: 'year',
                condition: '='
            }],
            withThrow: false,
            withDeleted: true,
            withRelations: true,
        });

        if (item) {
            return item;
        }

        const supplier = await this.supplierService.createToSheet(builtExpense.supplierName) as Supplier;

        const parentExpenseConstructor = new ExpenseConstructor({
            ...builtExpense,
            supplier,
        });

        const parentExpense = await this.customSave({ ...parentExpenseConstructor, children: undefined }) as Expense;

        if (!parentExpenseConstructor.is_aggregate) {
            if (parentExpenseConstructor.children) {
                if (!parentExpense.children) {
                    parentExpense.children = [];
                }
                for (const child of parentExpenseConstructor.children) {
                    const builtChildExpense = this.buildExpenseToSheet(child);
                    const item = await this.findOne({
                        value: builtChildExpense.name,
                        filters: [{
                            value: builtChildExpense.year,
                            param: 'year',
                            condition: '='
                        }],
                        withThrow: false,
                        withDeleted: true,
                        withRelations: true,
                    });
                    if (item) {
                        parentExpense.children.push(item);
                    }

                    const supplier = await this.supplierService.createToSheet(builtChildExpense.supplierName) as Supplier;

                    const childExpenseConstructor = new ExpenseConstructor({
                        ...builtChildExpense,
                        supplier,
                    });

                    const expense = await this.customSave(childExpenseConstructor);
                    if (expense) {
                        parentExpense.children.push(expense);
                    }
                }
                if (parentExpense.children.length) {
                    await this.customSave(parentExpense);
                }
            }
        }
        return parentExpense;
    }

    async getExpensesFromSheet(
        year: number,
        spreadsheet: Spreadsheet,
        bills: Bill[],
        groupName: string,
        nextRow: number
    ): Promise<Expense[]> {
        const expenses: Array<Expense> = [];
        const expensesData = this.expenseBusiness.parseToDetailsTable({
            bills,
            startRow: nextRow,
            groupName,
            workSheet: spreadsheet.workSheet
        });

        for (const itemData of expensesData) {
            const expense = await this.createToSheet({
                ...itemData,
                year,
            })
            if (expense) {
                expenses.push(expense);
            }
        }

        return expenses;
    }
}
