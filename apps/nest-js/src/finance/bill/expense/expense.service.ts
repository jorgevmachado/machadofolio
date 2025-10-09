import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
    EMonth,
    filterByCommonKeys,
    getCurrentMonthNumber,
    MONTHS,
    Spreadsheet,
    type TMonth,
    WorkSheet
} from '@repo/services';

import { EExpenseType, Expense as ExpenseConstructor, ExpenseBusiness, type ExpenseEntity } from '@repo/business';

import { FilterParams, Service } from '../../../shared';

import type { FinanceSeederParams } from '../../types';

import { Bill } from '../../entities/bill.entity';
import { Expense } from '../../entities/expense.entity';
import { Supplier } from '../../entities/supplier.entity';

import { SupplierService } from '../../supplier/supplier.service';

import { MonthService } from '../../month/month.service';
import { PersistMonthDto } from '../../month/dto/persist-month.dto';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UploadExpenseDto } from './dto/upload-expense.dto';

export type InitializeParams = {
    value?: number;
    type?: ExpenseEntity['type'];
    month?: ExpenseEntity['month'];
    expense: Expense;
    fromWorkSheet?: boolean;
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

    private async treatEntityParentParam(value?: string | Expense): Promise<Expense | undefined> {
        try {
            return await this.treatEntityParam<Expense>(
                value,
                'Expense Parent',
            ) as Expense;
        } catch (error) {
            return;
        }
    }

    async buildForCreation(bill: Bill, createExpenseDto: CreateExpenseDto) {
        const supplier = await this.supplierService.treatEntityParam<Supplier>(
            createExpenseDto.supplier,
            'Supplier',
        ) as Supplier;

        const parent = await this.treatEntityParentParam(createExpenseDto.parent);

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

    async initialize({ type, expense, value = 0, month, fromWorkSheet, instalment_number }: InitializeParams) {

        const expenseToInitialize = new ExpenseConstructor({
            ...expense,
            type: type ?? expense.type,
            instalment_number: instalment_number ?? expense.instalment_number,
        })

        const existExpense =  await this.validateExistExpense(expenseToInitialize, fromWorkSheet);

        const result = this.expenseBusiness.initialize(expenseToInitialize, month);
        const currentExpense  = !existExpense ? result.expenseForCurrentYear : { ...existExpense, ...result.expenseForCurrentYear };
        const initializedExpense = await this.create(currentExpense, result.monthsForCurrentYear, value);

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
        const expenseCreated = await this.create({ ...currentExpenseForNextYear, bill }, months, value);
        await this.validateParent(expenseCreated as Expense);
        return expenseCreated;
    }

    async create(expense: Expense, months: Array<TMonth> = [], value: number = 0) {
        const currentExpenseCalculated = this.expenseBusiness.calculate(expense);
        const savedExpense = await this.save(currentExpenseCalculated) as Expense;
        const monthList: Array<PersistMonthDto> = months.map((m) => this.monthService.business.generatePersistMonthParams({
            year: expense?.year,
            paid: expense?.paid,
            value: value,
            month: m.toUpperCase() as EMonth,
            received_at: expense.created_at
        }))
        const expenseMonths = this.monthService.business.generateMonthListCreationParameters({
            year: expense?.year,
            paid: expense?.paid,
            value: value,
            months: monthList,
            received_at: expense.created_at
        })
        if(expenseMonths?.length > 0) {
            savedExpense.months = await this.monthService.persistList(expenseMonths, { expense: savedExpense });
            const savedExpenseCalculated = this.expenseBusiness.calculate(savedExpense);
            return await this.save(savedExpenseCalculated);
        }
        return savedExpense;
    }

    async update(bill: Bill, param: string, body: UpdateExpenseDto) {
        const result = await this.findOne({ value: param, withRelations: true, filters: [{
            value: bill.id,
            param: `${this.alias}.bill`,
            relation: true,
            condition: '='
            }] }) as Expense;

        const supplier = !body?.supplier
            ? result.supplier
            : await this.supplierService.treatEntityParam<Supplier>(
                body.supplier,
                'Supplier',
            ) as Supplier;

        const updatedExpense = new ExpenseConstructor({
            ...result,
            bill,
            type: body?.type ?? result.type,
            paid: body?.paid ?? result.paid,
            supplier,
            description: body?.description ?? result?.description
        });

        if(result.name_code !== updatedExpense.name_code) {
            const filters: Array<FilterParams> = [
                {
                  value: updatedExpense.year,
                  param: `${this.alias}.year`,
                  relation: true,
                  condition: '=',
                },
                {
                    value: updatedExpense.name_code,
                    param: `${this.alias}.name_code`,
                    relation: true,
                    condition: 'LIKE',
                }
            ];
            const existingExpense = await this.findAll({ filters, withRelations: true }) as Array<Expense>;
            if(existingExpense.length > 0) {
                throw this.error(new ConflictException(`You cannot update this expense with this (supplier) ${updatedExpense.supplier.name} because there is already an expense linked to this supplier.`));
            }
        }

        const monthsToPersist = this.monthService.business.generateMonthListUpdateParameters(result?.months, body.months);
        if(monthsToPersist &&  monthsToPersist?.length > 0) {
            const months = await this.monthService.persistList(monthsToPersist, { expense: result });
            const expenseCalculated = this.expenseBusiness.calculate(updatedExpense);
            expenseCalculated.months = months;
            const savedExpense = await this.save(expenseCalculated);
            return {...savedExpense, months };
        }
        const expenseCalculated = this.expenseBusiness.calculate(updatedExpense);
        return await this.save(expenseCalculated);
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

        const expenses = await this.seeder.entities({
            by: 'id',
            key: 'id',
            label: 'Expense',
            seeds: childrenPrepared,
            withReturnSeed: true,
            createdEntityFn: async (item) => this.createdEntity(item, suppliers, bills)
        }) as Array<Expense>;

        const expenseList: Array<Expense> = [];

        for(const expense of expenses) {
            const currentExpense = seeds.find(seed => seed.id === expense.id);
            if(currentExpense) {
                const currentMonths: Array<PersistMonthDto> = MONTHS.map((month) => ({
                    year: currentExpense.year,
                    code: getCurrentMonthNumber(month),
                    paid: currentExpense[`${month}_paid`],
                    value: currentExpense[month],
                    month: month.toUpperCase() as EMonth,
                    received_at: currentExpense.created_at,
                }));
                expense.months = await this.monthService.persistList(currentMonths, { expense });
                const expenseCalculated = this.expenseBusiness.calculate(expense);
                const savedExpense = await this.save(expenseCalculated) as Expense;
                expenseList.push(savedExpense);
                continue;
            }
            expenseList.push(expense);
        }

        return expenseList;
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
            await this.create({
                ...parent,
                children: [expense],
            });
            return;
        }

        const existExpenseInChildren = parent.children.find((item) => item.id === expense.id);

        if (!existExpenseInChildren) {
            parent.children.push(expense);
            await this.create(parent)
        }
    }

    private async validateExistExpense(expense: Expense, fromWorkSheet?: boolean) {
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

        if (result.length && !fromWorkSheet) {
            throw this.error(new ConflictException('Expense already exists'));
        }

        return result[0];

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

        const parentExpense = await this.create({ ...parentExpenseConstructor, children: undefined }) as Expense;

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

                    const expense = await this.create(childExpenseConstructor);
                    if (expense) {
                        parentExpense.children.push(expense);
                    }
                }
                if (parentExpense.children.length) {
                    await this.create(parentExpense);
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
        const expensesData = this.expenseBusiness.spreadsheet.parseToDetailsTable({
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

    async buildForCreationBySpreadsheet(workSheet: WorkSheet, uploadExpenseDto: UploadExpenseDto) {
        const createdExpenses = this.expenseBusiness.spreadsheet.buildForCreation(workSheet, uploadExpenseDto);
        const listCreateExpenseDto: Array<CreateExpenseDto> = [];

        for(const createExpenseDto of createdExpenses) {
            if(createExpenseDto?.supplier) {
                const supplier = await this.supplierService.createToSheet(createExpenseDto.supplier as string) as Supplier;
                listCreateExpenseDto.push({
                    ...createExpenseDto,
                    supplier,
                });
            }
        }
        return listCreateExpenseDto;
    }
}
