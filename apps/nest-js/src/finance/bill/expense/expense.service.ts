import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { convertTypeToEnum, getMonthByIndex, Spreadsheet } from '@repo/services';

import { EExpenseType, Expense as ExpenseConstructor, ExpenseBusiness } from '@repo/business';

import EXPENSE_LIST_DEVELOPMENT_JSON from '../../../../seeds/development/finance/expenses.json';
import EXPENSE_LIST_STAGING_JSON from '../../../../seeds/staging/finance/expenses.json';
import EXPENSE_LIST_PRODUCTION_JSON from '../../../../seeds/production/finance/expenses.json';

import { FilterParams, type ListParams, Service } from '../../../shared';

import { Bill } from '../../entities/bill.entity';
import { Expense } from '../../entities/expense.entity';
import { Supplier } from '../../entities/supplier.entity';

import { SupplierService } from '../../supplier/supplier.service';

import { MonthService } from '../../month/month.service';
import { PersistMonthDto } from '../../month/dto/persist-month.dto';

import { CreateExpenseDto } from './dto/create-expense.dto';

import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UploadsExpenseDto } from './dto/uploads-expense.dto';
import { UploadExpenseDto } from './dto/upload-expense.dto';

import type { GeneratedExpenseSeeds } from './types';

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

    async create(bill: Bill, createExpenseDto: CreateExpenseDto) {
        const supplier = await this.supplierService.treatEntityParam<Supplier>(
            createExpenseDto.supplier,
            'Supplier',
        ) as Supplier;

        const parent = await this.treatEntityParentParam(createExpenseDto?.parent);

        const builtExpense = new ExpenseConstructor({
            supplier,
            bill,
            year: bill.year,
            type: createExpenseDto.type,
            paid: Boolean(createExpenseDto.paid),
            parent,
            description: createExpenseDto.description,
            is_aggregate: Boolean(parent),
            aggregate_name: !parent ? undefined : createExpenseDto.aggregate_name,
            instalment_number: createExpenseDto.instalment_number,
        });

        await this.validateExistExpense(bill, builtExpense);

        const prepareForCreation = this.business.prepareForCreation({
            value: createExpenseDto.value,
            month: createExpenseDto.month,
            months: createExpenseDto.months,
            expense: builtExpense,
        });

        const expense = await this.save(prepareForCreation.expenseForCurrentYear) as Expense;

        if (prepareForCreation.monthsForCurrentYear.length > 0) {
            expense.months = await this.monthService.persistList(prepareForCreation.monthsForCurrentYear, { expense });
            const expenseCalculated = this.business.calculate(expense);
            prepareForCreation.expenseForCurrentYear = await this.save(expenseCalculated) as Expense;
        }

        return prepareForCreation;
    }

    async update(param: string, body: UpdateExpenseDto) {
        const result = await this.findOne({ value: param, withRelations: true }) as Expense;

        const supplier = !body?.supplier
            ? result.supplier
            : await this.supplierService.treatEntityParam<Supplier>(
                body.supplier,
                'Supplier',
            ) as Supplier;

        const updatedExpense = new ExpenseConstructor({
            ...result,
            type: body?.type ?? result.type,
            paid: body?.paid ?? result.paid,
            supplier,
            description: body?.description ?? result?.description
        });

        if (result.name_code !== updatedExpense.name_code) {
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
            if (existingExpense.length > 0) {
                throw this.error(new ConflictException(`You cannot update this expense with this (supplier) ${updatedExpense.supplier.name} because there is already an expense linked to this supplier.`));
            }
        }

        const monthsToPersist = this.monthService
            .business
            .generateMonthListUpdateParameters(updatedExpense?.months, body.months, body?.paid);
        if (monthsToPersist && monthsToPersist?.length > 0) {
            const months = await this.monthService.persistList(monthsToPersist, { expense: updatedExpense });
            updatedExpense.months = months;
            const expenseCalculated = this.business.calculate(updatedExpense);
            const savedExpense = await this.save(expenseCalculated);
            return { ...savedExpense, months };
        }
        return await this.save(updatedExpense);
    }

    async remove(value: string, filters: ListParams['filters'] = [], withDeleted: boolean = false) {
        const expense = await this.findOne({ value, filters, withDeleted, withRelations: true }) as Expense;

        if (expense) {
            await this.monthService.removeList({ expense });
            await this.softRemove(expense);
        }

        return { message: 'Successfully removed' };
    }

    async uploads(bill: Bill, files: Express.Multer.File[], uploadsExpenseDto: UploadsExpenseDto) {
        const createExpenseDtoList: Array<CreateExpenseDto> = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file || !file?.buffer) {
                throw this.error(new ConflictException('one of the files was not uploaded or is invalid.'));
            }

            const spreadsheet = new Spreadsheet();

            const worksheets = await spreadsheet.loadFile(file.buffer);

            const worksheet = worksheets[0];

            if (!worksheet) {
                throw this.error(new ConflictException('The Excel file does not contain any worksheets.'));
            }

            spreadsheet.updateWorkSheet(worksheet);
            const workSheet = spreadsheet.workSheet;

            const month = uploadsExpenseDto?.months?.[i];

            const uploadExpenseDto: UploadExpenseDto = {
                file: '',
                paid: uploadsExpenseDto?.paid?.[i],
                month: !month ? convertTypeToEnum(getMonthByIndex(i)) : month,
                replaceWords: uploadsExpenseDto?.replaceWords,
                repeatedWords: uploadsExpenseDto?.repeatedWords
            }

            const createExpenseDtoListToCreate = this.business.spreadsheet.buildForCreation(workSheet, uploadExpenseDto);
            const createExpenseDtoListToSave: Array<CreateExpenseDto> = [];

            for (const createExpenseDto of createExpenseDtoListToCreate) {
                const supplier = await this.supplierService.createToSheet(createExpenseDto.supplier as string) as Supplier;
                const month = this.monthService.business.generatePersistMonthParams({
                    year: bill.year,
                    paid: createExpenseDto?.paid,
                    value: createExpenseDto?.value,
                    month: createExpenseDto?.month,
                    received_at: createExpenseDto?.received_at
                });
                createExpenseDtoListToSave.push({
                    ...createExpenseDto,
                    months: [month],
                    supplier,
                });
            }

            createExpenseDtoList.push(...createExpenseDtoListToSave);
        }

        if (createExpenseDtoList.length === 0) {
            return [];
        }

        const initialPersistExpenseParams: Array<CreateExpenseDto> = [{
            type: EExpenseType.VARIABLE,
            value: 0,
            months: [],
            supplier: '',
            instalment_number: 1,
        }];

        const cleanPersistExpenseParamsBuilt = createExpenseDtoList.reduce((acc, item) => {
            const hasParam = acc.find((accItem) => accItem.supplier['name_code'] === item.supplier['name_code']);
            if (!hasParam) {
                const expenseToSave = createExpenseDtoList.filter((bep) => bep.supplier['name_code'] === item.supplier['name_code']);
                const expenseMonths = expenseToSave.flatMap((expense) => expense.months).filter((item) => !!item);
                acc.push({
                    type: item.type,
                    paid: item.paid,
                    value: 0,
                    months: expenseMonths,
                    supplier: item.supplier,
                    received_at: item.received_at,
                });
            }
            return acc;
        }, initialPersistExpenseParams).filter((item) => item?.months && item?.months?.length > 0 && item.supplier !== '');

        const expenses: Array<Expense> = [];
        for (const persistExpenseDto of cleanPersistExpenseParamsBuilt) {
            const builtExpense = new ExpenseConstructor({
                supplier: persistExpenseDto.supplier as Supplier,
                bill,
                year: bill.year,
                type: persistExpenseDto.type,
                paid: Boolean(persistExpenseDto.paid),
                description: persistExpenseDto.description,
                instalment_number: 1,
            });

            const existExpense = await this.validateExistExpense(bill, builtExpense);

            const isCreate = !existExpense?.id;

            const savedExpense = isCreate ? await this.save(builtExpense) as Expense : { ...existExpense };

            const expenseMonths: Array<PersistMonthDto> = isCreate
                ? this.monthService.business.generateMonthListCreationParameters({
                    year: savedExpense?.year,
                    paid: savedExpense?.paid,
                    months: persistExpenseDto?.months,
                    received_at: savedExpense?.created_at
                })
                : savedExpense?.months?.map((month) => {
                const monthToUpdate = persistExpenseDto?.months?.find((monthToUpdate) => monthToUpdate.code === month.code);

                if (!monthToUpdate) {
                    return month;
                }

                month.paid = Boolean(monthToUpdate.paid);
                month.value = monthToUpdate.value !== month.value ? monthToUpdate.value : month.value;
                month.received_at = monthToUpdate.received_at !== month.received_at ? monthToUpdate.received_at : month.received_at;
                return month;
            }) ?? [];

            if (expenseMonths?.length > 0) {
                savedExpense.months = await this.monthService.persistList(expenseMonths, { expense: savedExpense });
                const savedExpenseCalculated = this.business.calculate(savedExpense);
                return await this.save(savedExpenseCalculated);
            }

            expenses.push(savedExpense);
        }

        return expenses;
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

    private async validateExistExpense(bill: Bill, expense: Expense, withThrow: boolean = true) {
        const fallbackMessage = 'You cannot add this expense because it is already in use.';

        const hasExpense = bill.expenses?.find((item) => expense.name_code === item.name_code);

        if (hasExpense && withThrow) {
            throw this.error(new ConflictException(fallbackMessage));
        }

        if (hasExpense && !withThrow) {
            return hasExpense;
        }

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

        if (result.length && withThrow) {
            throw this.error(new ConflictException('Expense already exists'));
        }

        return result[0];

    }

    async generateSeeds(withExpense: boolean, financeSeedsDir: string): Promise<GeneratedExpenseSeeds> {
        const expenses = await this.generateEntitySeeds({
            seedsDir: financeSeedsDir,
            staging: EXPENSE_LIST_STAGING_JSON,
            withSeed: withExpense,
            production: EXPENSE_LIST_PRODUCTION_JSON,
            development: EXPENSE_LIST_DEVELOPMENT_JSON,
            withRelations: true,
            filterGenerateEntitySeedsFn: (json, item) => json.name === item.name || json.name_code === item.name_code,
        });

        return {
            months: this.business.monthsMapper(expenses.added),
            expenses
        }
    }

    async persistSeeds(withSeed: boolean) {
        const expenses = await this.persistEntitySeeds({
            withSeed,
            staging: EXPENSE_LIST_STAGING_JSON,
            production: EXPENSE_LIST_PRODUCTION_JSON,
            development: EXPENSE_LIST_DEVELOPMENT_JSON,
        })

        return {
            months: this.business.monthsMapper(expenses.added),
            expenses
        }
    }
}
