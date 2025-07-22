import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MONTHS, Spreadsheet, filterByCommonKeys, snakeCaseToNormal, toSnakeCase } from '@repo/services';

import { BillBusiness, Bill as BillConstructor, EBillType } from '@repo/business';

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

import type { BillSeederParams, CreateToSheetParams, ExistExpenseInBill, SpreadsheetProcessingParams } from './types';

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

        const type = createBillDto.type;

        const bill = new BillConstructor({
            name: type === EBillType.CREDIT_CARD ? `${name} ${bank.name}` : name,
            year: createBillDto.year,
            type,
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
                : type === EBillType.CREDIT_CARD ? `${group.name} ${snakeCaseToNormal(type)} ${bank.name}` : `${group.name} ${snakeCaseToNormal(type)}`;

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
        const currentYear = params.year ?? new Date().getFullYear();
        const bills = await this.findAllByGroupYear(params.groupId, currentYear);

        const detailTables = [
            EBillType.BANK_SLIP,
            EBillType.ACCOUNT_DEBIT,
            EBillType.PIX,
            EBillType.CREDIT_CARD,
        ];

        this.billBusiness.spreadsheetProcessing({
            ...params,
            year: currentYear,
            data: bills,
            summary: true,
            detailTables,
            summaryTitle: 'Summary',
            detailTablesHeader: ['month', 'value', 'paid'],
            summaryTableHeader: ['type', 'bank', ...MONTHS, 'paid', 'total'],
            allExpensesHaveBeenPaid: this.expenseService.business.allHaveBeenPaid,
            buildExpensesTablesParams: this.expenseService.business.buildTablesParams
        })
    }

    private async findAllByGroupYear(groupId: string, year: number) {
        const bills = await this.findAll({
            filters: [
                {
                    value: groupId,
                    param: 'group',
                    condition: '='
                },
                {
                    value: year,
                    param: 'year',
                    condition: '='
                }
            ],
            withRelations: true
        });

        if (Array.isArray(bills)) {
            return bills;
        }
        return [];
    }

    private async createToSheet(params: CreateToSheetParams) {
        const year = Number(params['year']);
        const type = params['type'] as EBillType;
        const groupName = params['group']?.toString() || '';
        const bankName = params['bank']?.toString() || '';
        const currentName = `${groupName} ${snakeCaseToNormal(type)}`;
        const name = type === EBillType.CREDIT_CARD ? `${currentName} ${bankName}` : currentName;
        const item = await this.findOne({
            value: name,
            filters: [{
                value: year,
                param: 'year',
                condition: '='
            }],
            withDeleted: true,
            withThrow: false
        });

        if (item) {
            return item;
        }

        const finance = params.finance;
        const bank = await this.bankService.createToSheet(bankName) as Bank;

        const group = await this.groupService.createToSheet(finance, groupName) as Group;

        const bill = new BillConstructor({
            name,
            year,
            type,
            finance,
            bank,
            group,
        })

        return await this.save(bill);
    }


    async initializeBySpreadsheet(buffer: Buffer<ArrayBufferLike>, finance: Finance): Promise<Array<{
        groupName: string;
        bills: number;
        expenses: number;
    }>> {
        const result: Array<{ groupName: string; bills: number; expenses: number; }> = [];
        const spreadsheet = new Spreadsheet();
        const worksheets = await spreadsheet.loadFile(buffer);

        for (const worksheet of worksheets) {
            if (!worksheet) {
                throw new ConflictException('The Excel file does not contain any worksheets.');
            }
            spreadsheet.updateWorkSheet(worksheet);
            const { groupName, expenses, bills } = await this.initializeWithWorksheet(spreadsheet, finance);
            result.push({ groupName, bills: bills.length, expenses: expenses.length });
        }
        return result;
    }

    private async initializeWithWorksheet(spreadsheet: Spreadsheet, finance: Finance): Promise<{
        groupName: string;
        bills: Array<Bill>;
        expenses: Array<Expense>;
    }> {
        const { year, groupName, nextRow: titleNextRow } = this.billBusiness.getWorkSheetTitle({
            row: 2,
            column: 2,
            workSheet: spreadsheet.workSheet,
        });
        const summaryCell = spreadsheet.workSheet.cell(titleNextRow, 2);
        const summaryCellValue = summaryCell.value ? summaryCell.value.toString().trim() : '';
        const summaryCellNextRow = Number(summaryCell.row) + 1;

        if (summaryCellValue !== 'Summary') {
            throw new ConflictException(
                `The worksheet does not contain a summary table. The worksheet must contain a summary table with the title "Summary".`,
            );
        }

        const { bills, nextRow } = await this.getBillsFromSheet(
            spreadsheet,
            titleNextRow,
            summaryCellNextRow,
            year,
            groupName,
            finance,
        )

        const expenses: Array<Expense> = await this.expenseService.getExpensesFromSheet(
            year,
            spreadsheet,
            bills,
            groupName,
            nextRow
        );

        return {
            groupName,
            bills,
            expenses,
        }
    }


    private async getBillsFromSheet(
        spreadsheet: Spreadsheet,
        titleNextRow: number,
        summaryCellNextRow: number,
        year: number,
        groupName: string,
        finance: Finance
    ): Promise<{ bills: Array<Bill>; nextRow: number }> {
        const tableHeader = ['type', 'bank', ...MONTHS, 'paid', 'total'];
        const filterTitle = ['TOTAL'];
        const {
            data,
            nextRow
        } = spreadsheet.parseExcelRowsToObjectList(summaryCellNextRow, titleNextRow, filterTitle, tableHeader);

        if (nextRow === titleNextRow) {
            return { bills: [], nextRow };
        }

        const bills: Array<Bill> = [];

        for (const item of data) {
            const type = !item['type'] ? 'bank_slip' : item['type'].toString();

            const bill = await this.createToSheet({
                ...item,
                type: toSnakeCase(type).toUpperCase(),
                year,
                group: groupName,
                finance
            }) as Bill;

            bills.push(bill);
        }

        return { bills, nextRow };
    }
}
