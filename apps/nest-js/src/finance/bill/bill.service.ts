import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services/object/object';

import { snakeCaseToNormal } from '@repo/services/string/string';

import BillBusiness from '@repo/business/finance/bill/business/business';
import BillConstructor from '@repo/business/finance/bill/bill';

import { FilterParams, ListParams, Service } from '../../shared';

import type { FinanceSeederParams } from '../types';

import { Bank } from '../entities/bank.entity';
import { Bill } from '../entities/bill.entity';
import { BillCategory } from '../entities/category.entity';
import { Expense } from '../entities/expense.entity';
import { Finance } from '../entities/finance.entity';

import { BankService } from './bank/bank.service';
import { CategoryService } from './category/category.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { ExpenseService } from './expense/expense.service';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UpdateExpenseDto } from './expense/dto/update-expense.dto';

type ExistExpenseInBill = {
    year?: number;
    nameCode: string;
    withThrow?: boolean;
    fallBackMessage?: string;
}

type BillSeederParams = FinanceSeederParams & {
    finance: Finance;
}

@Injectable()
export class BillService extends Service<Bill> {
    constructor(
        @InjectRepository(Bill)
        protected repository: Repository<Bill>,
        protected billBusiness: BillBusiness,
        protected readonly bankService: BankService,
        protected readonly categoryService: CategoryService,
        protected readonly expenseService: ExpenseService,
    ) {
        super(
            'bills',
            ['bank', 'category', 'finance', 'expenses', 'expenses.supplier'],
            repository,
        );
    }

    get bank(): BankService {
        return this.bankService;
    }

    get category(): CategoryService {
        return this.categoryService;
    }

    get expense(): ExpenseService {
        return this.expenseService;
    }

    async create(finance: Finance, createBillDto: CreateBillDto) {
        const bank = await this.bankService.treatEntityParam<Bank>(
            createBillDto.bank,
            'Bank'
        ) as Bank;

        const category = await this.categoryService.treatEntityParam<BillCategory>(
            createBillDto.category,
            'Bill Category'
        ) as BillCategory;

        const name = `${category.name} ${snakeCaseToNormal(createBillDto.type)}`;

        const bill = new BillConstructor({
            name,
            year: createBillDto.year,
            type: createBillDto.type,
            finance,
            bank,
            category,
        })

        return await this.customSave(bill);
    }

    async update(finance: Finance, param: string, updateBillDto: UpdateBillDto) {
        const result = await this.findOne({ value: param }) as Bill;

        const bank = !updateBillDto.bank
            ? result.bank
            : await this.bankService.treatEntityParam<Bank>(
                updateBillDto.bank,
                'Bank',
            ) as Bank;

        const category = !updateBillDto.category
            ? result.category
            : await this.categoryService.treatEntityParam<BillCategory>(
                updateBillDto.category,
                'Bill Category',
            ) as BillCategory;

        const expenses = !updateBillDto.expenses
            ? result.expenses
            : await Promise.all(
                await this.expenseService.treatEntitiesParams<Expense>(
                    updateBillDto.expenses,
                    'Expense',
                ),
            ) as Array<Expense>;

        const year = !updateBillDto.year ? result.year : updateBillDto.year;
        const type = !updateBillDto.type ? result.type : updateBillDto.type;
        const name =
            !updateBillDto.category && !updateBillDto.type
                ? result.name
                : `${category.name} ${snakeCaseToNormal(type)}`;

        const updatedBill = new BillConstructor({
            ...result,
            name,
            year,
            type,
            finance,
            bank,
            category,
            expenses
        });
        return await this.customSave(updatedBill);
    }

    private async customSave(bill: Bill, withThrow = true) {
        const existBill = await this.findOne({
            value: bill.name,
            filters: [{
                value: bill.year,
                param: 'year',
                condition: '='
            }],
            withThrow: false,
        });
        if (existBill) {
            if (withThrow) {
                throw new ConflictException(
                    `Key (name)=(${bill.name}) already exists with this (year)=(${bill.year}).`,
                );
            }
            return existBill;
        }
        const calculatedBill = this.billBusiness.calculate(bill);
        return await this.save(calculatedBill);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
            relations: this.relations,
        }) as Bill;
        if (result?.expenses?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete this bill because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async addExpense(param: string, createExpenseDto: CreateExpenseDto) {
        const bill = await this.findOne({ value: param }) as Bill;
        const createdExpense = await this.expenseService.buildForCreation(
            bill,
            createExpenseDto,
        );

        const existExpense = await this.existExpenseInBill({
            year: createdExpense.year,
            nameCode: createdExpense.name_code,
            withThrow: false,
        });


        const { type, value, month, instalment_number } = createExpenseDto;

        const {
            nextYear,
            requiresNewBill,
            monthsForNextYear,
            expenseForNextYear,
            expenseForCurrentYear,
        } = await this.expenseService.initialize({
            type,
            value,
            month,
            expense: !existExpense ? createdExpense : existExpense,
            instalment_number,
        });


        if (requiresNewBill && expenseForNextYear) {
            const newBill = (await this.createNewBillForNextYear(
                nextYear,
                bill,
            )) as Bill;

            const existingExpense = await this.existExpenseInBill({
                year: nextYear,
                nameCode: expenseForNextYear.name_code,
                withThrow: false,
            });

            await this.expenseService.addExpenseForNextYear(newBill, monthsForNextYear, expenseForNextYear, existingExpense);
        }

        return expenseForCurrentYear;
    }

    private async existExpenseInBill({
                                         year,
                                         nameCode,
                                         withThrow = true,
                                         fallBackMessage = 'You cannot add this expense because it is already in use.',
                                     }: ExistExpenseInBill) {
        const filters: Array<FilterParams> = [
            {
                value: nameCode,
                param: 'expenses.name_code',
                relation: true,
                condition: 'LIKE',
            },
        ];
        if (year) {
            filters.push({
                value: year,
                param: 'expenses.year',
                relation: true,
                condition: '=',
            });
        }

        const result = (await this.findAll({ filters })) as Array<Bill>;

        if (withThrow && result.length) {
            throw this.error(new ConflictException(fallBackMessage));
        }

        return result[0]?.expenses?.[0];
    }

    private async createNewBillForNextYear(year: number, bill: Bill) {
        const currentBill = new BillConstructor({
            ...bill,
            id: undefined,
            year,
            expenses: [],
        });
        return await this.customSave(currentBill, false);
    }

    async findOneExpense(param: string, expenseId: string) {
        const bill = await this.findOne({ value: param }) as Bill;
        return await this.expenseService.findOne({
            value: expenseId,
            filters: [
                {
                    value: bill.id,
                    param: 'bill',
                    condition: '=',
                },
            ],
        });
    }

    async findAllExpense(param: string, params: ListParams) {
        const bill = await this.findOne({ value: param }) as Bill;
        return await this.expenseService.findAll({
            ...params,
            filters: [
                {
                    value: bill.id,
                    param: 'bill',
                    condition: '=',
                },
            ],
        });
    }

    async removeExpense(param: string, expenseId: string) {
        const expense = await this.findOneExpense(param, expenseId) as Expense;
        await this.expenseService.softRemove(expense);
        return { message: 'Successfully removed' };
    }

    async updateExpense(param: string, expenseId: string, updateExpenseDto: UpdateExpenseDto) {
        const expense = await this.findOneExpense(param, expenseId) as Expense;
        const updatedExpense = await this.expenseService.buildForUpdate(
            expense,
            updateExpenseDto,
        );

        if (expense.name_code !== updatedExpense.name_code) {
            await this.existExpenseInBill({
                year: updatedExpense.year,
                nameCode: updatedExpense.name_code,
                fallBackMessage: `You cannot update this expense with this (supplier) ${updatedExpense.supplier.name} because there is already an expense linked to this supplier.`,
            });
        }

        return await this.expenseService.customSave(updatedExpense);
    }

    async seeds({
                    finance,
                    bankListJson,
                    categoryListJson,
                    billListJson: listJson,
                    withReturnSeed = true,
                }: BillSeederParams) {

        const categoryList = await this.seeder.executeSeed<BillCategory>({
            label: 'Bill Categories',
            seedMethod: async () => {
                const result = await this.categoryService.seeds({ categoryListJson });
                return Array.isArray(result) ? result : [];
            },
        });

        const bankList = await this.seeder.executeSeed<Bank>({
            label: 'Banks',
            seedMethod: async () => {
                const result = await this.bankService.seeds({ bankListJson });
                return Array.isArray(result) ? result : [];
            }
        });
        if (!listJson) {
            return [];
        }
        const seeds = listJson.map((item) => transformObjectDateAndNulls<Bill, unknown>(item));
        return this.seeder.entities({
            by: 'id',
            key: 'id',
            label: 'Bill',
            seeds,
            withReturnSeed,
            createdEntityFn: async (item) => {
                const bank = this.seeder.getRelation<Bank>({
                    key: 'name',
                    list: bankList as Array<Bank>,
                    param: item?.bank?.name,
                    relation: 'Bank'
                });

                const category = this.seeder.getRelation<BillCategory>({
                    key: 'name',
                    list: categoryList as Array<BillCategory>,
                    param: item?.category?.name,
                    relation: 'Bill Category'
                });

                return new BillConstructor({
                    ...item,
                    finance,
                    bank,
                    category,
                    expenses: undefined,
                })
            }
        });


    }
}
