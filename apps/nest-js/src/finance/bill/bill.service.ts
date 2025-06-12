import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { filterByCommonKeys } from '@repo/services/array/array';
import { snakeCaseToNormal } from '@repo/services/string/string';

import BillBusiness from '@repo/business/finance/bill/business/business';
import BillConstructor from '@repo/business/finance/bill/bill';

import { FilterParams, ListParams, Service } from '../../shared';

import { Bank } from '../entities/bank.entity';
import { Bill } from '../entities/bill.entity';
import { Expense } from '../entities/expense.entity';
import { Finance } from '../entities/finance.entity';
import { Group } from '../entities/group.entity';

import { BankService } from '../bank/bank.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { ExpenseService } from './expense/expense.service';
import { GroupService } from '../group/group.service';
import { UpdateBillDto } from './dto/update-bill.dto';
import { UpdateExpenseDto } from './expense/dto/update-expense.dto';

import { BillSeederParams, ExistExpenseInBill, SpreadsheetProcessingParams } from './types';


@Injectable()
export class BillService extends Service<Bill> {
    constructor(
        @InjectRepository(Bill)
        protected repository: Repository<Bill>,
        protected billBusiness: BillBusiness,
        protected readonly bankService: BankService,
        protected readonly groupService: GroupService,
        protected readonly expenseService: ExpenseService,
    ) {
        super(
            'bills',
            ['bank', 'group', 'finance', 'expenses', 'expenses.supplier', 'expenses.bill', 'expenses.children', 'expenses.children.supplier'],
            repository,
        );
    }

    get expense(): ExpenseService {
        return this.expenseService;
    }

    async create(finance: Finance, createBillDto: CreateBillDto) {
        const bank = await this.bankService.treatEntityParam<Bank>(
            createBillDto.bank,
            'Bank'
        ) as Bank;

        const group = await this.groupService.treatEntityParam<Group>(
            createBillDto.group,
            'Group'
        ) as Group;

        const name = `${group.name} ${snakeCaseToNormal(createBillDto.type)}`;

        const bill = new BillConstructor({
            name,
            year: createBillDto.year,
            type: createBillDto.type,
            finance,
            bank,
            group,
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

        const group = !updateBillDto.group
            ? result.group
            : await this.groupService.treatEntityParam<Group>(
                updateBillDto.group,
                'Bill Category',
            ) as Group;

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
            !updateBillDto.group && !updateBillDto.type
                ? result.name
                : `${group.name} ${snakeCaseToNormal(type)}`;

        const updatedBill = new BillConstructor({
            ...result,
            name,
            year,
            type,
            finance,
            bank,
            group,
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
        const bill = await this.findOne({ value: param, withRelations: true }) as Bill;
        const createdExpense = await this.expenseService.buildForCreation(
            bill,
            createExpenseDto,
        );

        const existExpense = await this.existExpenseInBill({
            year: createdExpense.year,
            nameCode: createdExpense.name_code,
            withThrow: false,
        });

        const currentExistExpense = !existExpense ? undefined : {
            ...existExpense,
            parent: createdExpense?.parent,
            is_aggregate: createdExpense?.is_aggregate,
            aggregate_name: createdExpense?.aggregate_name,
        }

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
            expense: !currentExistExpense ? createdExpense : currentExistExpense,
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

        const result = (await this.findAll({ filters, withRelations: true })) as Array<Bill>;

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
            withRelations: true,
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
        const bill = await this.findOne({ value: param, withRelations: true }) as Bill;
        return await this.expenseService.findAll({
            ...params,
            filters: [
                {
                    value: bill.id,
                    param: 'bill',
                    condition: '=',
                },
                {
                    value: false,
                    param: 'is_aggregate',
                    condition: '='
                }
            ],
            withRelations: true
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
                    banks,
                    groups,
                    billListJson: seedsJson
                }: BillSeederParams) {
        const billListSeed = this.seeder.currentSeeds<Bill>({ seedsJson });
        const financeBillListSeed = filterByCommonKeys<Bill>('id', billListSeed, finance.bills ?? []);
        return this.seeder.entities({
            by: 'id',
            key: 'id',
            label: 'Bill',
            seeds: financeBillListSeed,
            withReturnSeed: true,
            createdEntityFn: async (item) => {
                const bank = this.seeder.getRelation<Bank>({
                    key: 'name',
                    list: banks,
                    param: item?.bank?.name,
                    relation: 'Bank'
                });

                const group = this.seeder.getRelation<Group>({
                    key: 'name',
                    list: groups,
                    param: item?.group?.name,
                    relation: 'Group'
                });

                return new BillConstructor({
                    ...item,
                    finance,
                    bank,
                    group,
                    expenses: undefined,
                })
            }
        });
    }

    async spreadsheetProcessing(params: SpreadsheetProcessingParams) {
        const bills = await this.findAllByGroup(params.groupId);
        this.billBusiness.spreadsheetProcessing({
            ...params,
            bills,
            totalExpenseByMonth: this.expenseService.business.totalByMonth,
            allExpensesHaveBeenPaid: this.expenseService.business.allHaveBeenPaid,
            buildExpensesTablesParams: this.expenseService.business.buildTablesParams
        })
    }

    private async findAllByGroup(groupId: string) {
        const bills = await this.findAll({
            filters: [{
                value: groupId,
                param: 'group',
                condition: '='
            }],
            withRelations: true
        });

        if (Array.isArray(bills)) {
            return bills;
        }
        return [];
    }

}
