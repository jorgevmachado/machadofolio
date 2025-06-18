import * as ExcelJS from 'exceljs';

import { cleanTextByListText, snakeCaseToNormal, toSnakeCase } from '@repo/services/string/string';

import { type CycleOfMonths, MONTHS } from '@repo/services/date/month/month';

import { EBillType } from '@repo/business/finance/bill/enum';

import { Buffer } from 'buffer';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';

import FinanceConstructor from '@repo/business/finance/finance';

import { Service } from '../shared';

import { User } from '../auth/entities/user.entity';

import { Bank } from './entities/bank.entity';
import { BankService } from './bank/bank.service';
import { Bill } from './entities/bill.entity';
import { BillService } from './bill/bill.service';
import { Expense } from './entities/expense.entity';
import { Finance } from './entities/finance.entity';
import { FinanceSeedsParams } from './types';
import { Group } from './entities/group.entity';
import { GroupService } from './group/group.service';
import { Supplier } from './entities/supplier.entity';
import { SupplierService } from './supplier/supplier.service';
import { SupplierType } from './entities/type.entity';

type DataAccumulator = Array<Record<string, string | number | boolean | object>>;

@Injectable()
export class FinanceService extends Service<Finance> {
    constructor(
        @InjectRepository(Finance)
        protected repository: Repository<Finance>,
        protected readonly bankService: BankService,
        protected readonly groupService: GroupService,
        protected readonly supplierService: SupplierService,
        protected readonly billService: BillService,
    ) {
        super('finances', ['bills', 'bills.expenses'], repository);
    }

    async initialize(user: User) {
        if (user?.finance) {
            return {
                ...user.finance,
                user
            };
        }
        const finance = new FinanceConstructor({ user });
        return await this.save(finance);
    }

    async generateDocument(user: User, year?: number): Promise<Buffer> {
        const finance = this.validateFinance(user);
        const groups = await this.fetchGroups(finance.id);

        const sheet = new Spreadsheet();
        const groupsName: Array<string> = groups.map((group) => group.name);
        await Promise.all(
            groups.map(group => this.billService.spreadsheetProcessing({
                year,
                groupId: group.id,
                sheet,
                startRow: 14,
                groupName: group.name,
                tableWidth: 3,
                groupsName,
                startColumn: 2,
            }))
        )

        return await sheet.generateSheetBuffer();
    }

    private validateFinance(user: User): Finance {
        if (!user?.finance) {
            throw new ConflictException('Finance not found');
        }
        return user.finance;
    }

    private async fetchGroups(financeId: string) {
        return await this.groupService.findAll({
            filters: [{
                value: financeId,
                param: 'finance',
                condition: '='
            }],
            withRelations: true
        }) as Array<Group>;
    }

    async seeds(financeSeedsParams: FinanceSeedsParams) {
        const finances = await this.seed(financeSeedsParams.financeListJson, financeSeedsParams.users) as Array<Finance>;
        const banks: Array<Bank> = await this.seeder.executeSeed<Bank>({
            label: 'Banks',
            seedMethod: async () => {
                const result = await this.bankService.seeds({ bankListJson: financeSeedsParams.bankListJson });
                return Array.isArray(result) ? result : [];
            }
        })
        const {
            supplierList,
            supplierTypeList
        } = await this.supplierService.seeds({
            supplierListJson: financeSeedsParams.supplierListJson,
            supplierTypeListJson: financeSeedsParams.supplierTypeListJson
        })
        const suppliers: Array<Supplier> = supplierList;
        const supplierTypes: Array<SupplierType> = supplierTypeList;

        const groups: Array<Group> = await this.seeder.executeSeed<Group>({
            label: 'Group',
            seedMethod: async () => {
                const result = await this.groupService.seeds({
                    finances,
                    groupListJson: financeSeedsParams.groupListJson
                });
                return Array.isArray(result) ? result : [];
            }
        });

        const addedBillIds = new Set<string>();
        const bills: Array<Bill> = [];

        const addedExpenseIds = new Set<string>();
        const expenses: Array<Expense> = [];

        const financeListSeed = this.seeder.currentSeeds<Finance>({ seedsJson: financeSeedsParams.financeListJson });

        for (const finance of finances) {
            const financeSeed = financeListSeed.find((item) => item.id === finance.id);
            if (financeSeed) {
                const billList = await this.seeder.executeSeed<Bill>({
                    label: 'Bills',
                    seedMethod: async () => {
                        const result = await this.billService.seeds({
                            finance: financeSeed,
                            banks,
                            groups,
                            billListJson: financeSeedsParams.billListJson,
                        });
                        return Array.isArray(result) ? result : [];
                    },
                });

                for (const bill of billList) {
                    if (!addedBillIds.has(bill.id)) {
                        bills.push(bill);
                        addedBillIds.add(bill.id);
                    }
                }

                const expenseList = await this.seeder.executeSeed<Expense>({
                    label: 'Expenses',
                    seedMethod: async () => {
                        const result = await this.billService.expense.seeds({
                            bills: billList,
                            suppliers,
                            billListJson: financeSeedsParams.billListJson,
                            expenseListJson: financeSeedsParams.expenseListJson,
                        });
                        return Array.isArray(result) ? result : [];
                    },
                });
                for (const expense of expenseList) {
                    if (!addedExpenseIds.has(expense.id)) {
                        expenses.push(expense);
                        addedExpenseIds.add(expense.id);
                    }
                }
            }
        }


        return {
            bills: bills,
            groups: groups,
            banks: banks,
            expenses: expenses,
            finances: finances,
            suppliers: suppliers,
            supplierTypes: supplierTypes,
        }
    }

    private async seed(seedsJson: Array<unknown> = [], users: Array<User>) {
        return this.seeder.entities({
            by: 'id',
            key: 'all',
            label: 'Finance',
            seedsJson,
            withReturnSeed: true,
            createdEntityFn: async (entity) => {
                const user = users.find((item) => item.cpf === entity.user.cpf);
                if (!user) {
                    return;
                }
                return new FinanceConstructor({
                    ...entity,
                    user,
                    bills: undefined,
                })
            }
        });
    }

    async initializeWithDocument(file: Express.Multer.File, user: User) {
        if (!file?.buffer) {
            throw new ConflictException('File not sent or invalid.');
        }

        const result: Array<{ groupName: string; bills: number; expenses: number; }> = [];
        const finance = await this.initialize(user) as Finance;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheets = workbook.worksheets;

        for(const worksheet of worksheets) {
            if (!worksheet) {
                throw new ConflictException('The Excel file does not contain any worksheets.');
            }

            const { groupName, expenses, bills } = await this.initializeWithWorksheet(worksheet, finance);
            result.push({
                groupName,
                bills: bills.length,
                expenses: expenses.length,
            });
        }
        return result;

    }

    private async initializeWithWorksheet(worksheet: ExcelJS.Worksheet, finance: Finance) {
        const titleCell = worksheet.getCell('B2');

        const fullText = titleCell.value ? titleCell.value.toString().trim() : '';
        const match = fullText.match(/^(.+?)\s*\((\d{4})\)$/);

        const currentYear = new Date().getFullYear();
        const title = {
            year: !match ? currentYear : Number(match[2]),
            name: !match ? fullText : match[1]?.trim() || fullText,
        }

        const year = title.year || currentYear;
        const groupName = title.name;
        const titleNextRow = 14

        const summaryTableCell = worksheet.getCell('B14');
        const summaryTableCellValue = summaryTableCell.value ? summaryTableCell.value.toString().trim() : '';
        const summaryTableCellValueNextRow = Number(summaryTableCell.row) + 1;
        const bills: Array<Bill> = [];
        const expenses: Array<Expense> = [];
        const expensesData: Array<Record<string, string | number | boolean | object>> = [];
        if(summaryTableCellValue === 'Summary') {
            const summaryTableHeaderCellRow = worksheet.getRow(summaryTableCellValueNextRow);
            const tableHeader = ['type', 'bank', ...MONTHS, 'paid', 'total'];
            const filterTitle = ['TOTAL'];
            const { data, nextRow } = this.generateObjList(summaryTableHeaderCellRow, worksheet, titleNextRow, filterTitle, tableHeader)

            if(nextRow !== titleNextRow) {
                for(const item of data) {
                    const type = !item['type'] ? '' : item['type'].toString();

                    const bill = await this.billService.createToSheet({
                        ...item,
                        type: toSnakeCase(type).toUpperCase(),
                        year,
                        group: groupName,
                        finance
                    }) as Bill;

                    bills.push(bill);
                }
            }

            const secondaryBillList = bills.filter((bill) => bill.type !== EBillType.CREDIT_CARD);
            const { data: secondaryTableList, nextRow: secondaryTableListNextRow } = this.generateDetailsTable(
                worksheet,
                nextRow,
                secondaryBillList
            );

            if(secondaryTableListNextRow !== nextRow) {
                expensesData.push(...secondaryTableList);
            }

            const creditCardBillList = bills.filter((bill) => bill.type === EBillType.CREDIT_CARD);
            const { data: creditCardTableList , nextRow: creditCardTableListNextRow } = this.generateCreditCardTable(
                worksheet,
                groupName,
                secondaryTableListNextRow,
                creditCardBillList
            )
            if(creditCardTableListNextRow !== secondaryTableListNextRow) {
                expensesData.push(...creditCardTableList);
            }
        }

        for(const itemData of expensesData) {
            const expense = await this.billService.expense.createToSheet({
                ...itemData,
                year: currentYear,
            })
            if(expense) {
                expenses.push(expense);
            }
        }

        return {
            groupName,
            bills,
            expenses,
        }
    }

    private generateObjList(row: ExcelJS.Row, worksheet: ExcelJS.Worksheet, startRow: number, ignoreTitles: Array<string> = [], header: Array<string> = []) {
        const normalizedHeader = header.map(h => h.trim().toLowerCase());
        const headerMap: { [col: number]: string } = {};
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const header = String(cell.value).trim().toLowerCase();
            if(normalizedHeader.includes(header)) {
                headerMap[colNumber] = header;
            }
        });

        const rowNumbers = Array.from(
            { length: worksheet.rowCount - startRow },
            (_, idx) => idx + startRow + 1
        );

        const rowsParsed = rowNumbers.map(rowNumber => {
            const currentRow = worksheet.getRow(rowNumber);
            if (!currentRow) return null;

            const obj = Object.keys(headerMap).reduce(
                (acc, key) => {
                    const colNum = Number(key);
                    const mapKey = headerMap[colNum];
                    const value = currentRow.getCell(colNum).value;
                    if(mapKey) {
                        acc[mapKey] =
                            (typeof value === 'object' && value !== null && 'result' in value)
                                ? (value as any).result
                                : value ?? '';
                    }
                    return acc;
                },
                {} as Record<string, string | number>
            );

            const rowIsEmpty = Object.values(obj).every(
                value => value === null || value === undefined || value === ''
            );
            return rowIsEmpty ? null : obj;
        });

        const normalizedIgnoreTitles = ignoreTitles.map(t => t.trim().toLowerCase());
        const data: Array<Record<string, string | number>> = [];
        const totalData: Array<Record<string, string | number>> = [];
        for (const item of rowsParsed) {
            if (!item) break;
            totalData.push(item);
            const typeField = normalizedHeader.find(h => h === 'type');
            const itemTitle = typeField && typeof item[typeField] === 'string'
                ? item[typeField].trim().toLowerCase()
                : '';

            const hasHeaderValue = normalizedHeader.some(
                h => (typeof item[h] === 'string' && item[h].trim().toLowerCase() === h)
            );

            if(!hasHeaderValue && !normalizedIgnoreTitles.includes(itemTitle)) {
                data.push(item)
            }
        }

        return { data, nextRow: startRow + totalData.length + 1 + 1 };
    }

    private buildDetailData(worksheet: ExcelJS.Worksheet, cell: ExcelJS.Cell, row: number, column: number, bill: Bill) {
        const title = cell.value ? cell.value.toString().trim() : '';
        if(title === '') {
            return;
        }
        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = 0;
            acc[`${month}_paid`] = false;
            return acc;
        }, {} as CycleOfMonths);
        const bodyData = {
            ...monthsObj,
            bill,
            supplier: title
        }
        let tableRow = row;
        MONTHS.forEach((month) => {
            const valueCell = worksheet.getCell(tableRow, column);
            const valueText = valueCell.value ? valueCell.value.toString().trim() : '0';
            bodyData[month] = Number(valueText);
            const paidCell = worksheet.getCell(tableRow, column + 1);
            const paidText = paidCell.value ? paidCell.value.toString().trim() : 'NO';
            bodyData[`${month}_paid`] = paidText === 'YES';
            tableRow++;
        });

        return bodyData;
    }

    private buildGroupTable(worksheet: ExcelJS.Worksheet, row: number, bill: Bill) {
        const tableCell1 = worksheet.getCell(row, 3);
        if(tableCell1.isMerged && tableCell1['_mergeCount'] === 2) {
            const groupTableData: Array<Record<string, string | number | boolean | object | Bill>> = [];
            const groupTableRow = row + 2;
            const groupTable1Data1 = this.buildDetailData(worksheet, tableCell1, groupTableRow, 4, bill);
            if(groupTable1Data1) {
                groupTableData.push(groupTable1Data1);
            }
            const tableCell2 = worksheet.getCell(row, 8);
            const groupTable1Data2 = this.buildDetailData(worksheet, tableCell2, groupTableRow, 9, bill);
            if(groupTable1Data2) {
                groupTableData.push(groupTable1Data2);
            }

            const tableCell3 = worksheet.getCell(row, 13);
            const groupTable1Data3 = this.buildDetailData(worksheet, tableCell3, groupTableRow, 14, bill);
            if(groupTable1Data3) {
                groupTableData.push(groupTable1Data3);
            }
            return { data: groupTableData, nextRow: row + 12 + 1 + 1 + 1, hasNext: true };
        }

        return { data: [], nextRow: row, hasNext: false };

    }

    private generateDetailsTable(worksheet: ExcelJS.Worksheet, startRow: number, bills: Array<Bill>) {
        const billTypeMap = new Map(bills.map(bill => [bill.type, bill]));

        const collectGroupsRecursively = (row: number, acc: DataAccumulator): { data: DataAccumulator; nextRow: number } => {
            const cell = worksheet.getCell(row, 3);
            const type = cell.value ? cell.value.toString().trim() : '';
            if (!type) {
                return { data: acc, nextRow: row };
            }

            const bill = billTypeMap.get(type as EBillType);

            if (!bill) {
                return { data: acc, nextRow: row };
            }

            const { acc: filledAcc, lastRow } = this.accumulateGroupTables(worksheet, row + 1, bill, acc);
            return collectGroupsRecursively(lastRow, filledAcc);
        }

        const { data, nextRow } = collectGroupsRecursively(startRow, []);
        return { data, nextRow };

    }

    private accumulateGroupTables(worksheet: ExcelJS.Worksheet, startRow: number, bill: Bill, acc: DataAccumulator): { acc: DataAccumulator; lastRow: number;} {
        const constructedGroupTable = this.buildGroupTable(worksheet, startRow, bill);
        const updatedAcc = [...acc, ...constructedGroupTable.data];
        if(constructedGroupTable.hasNext) {
            return this.accumulateGroupTables(worksheet, constructedGroupTable.nextRow, bill, updatedAcc);
        }
        return { acc: updatedAcc, lastRow: constructedGroupTable.nextRow };
    }

    private generateCreditCardTable(
        worksheet: ExcelJS.Worksheet,
        groupName: string,
        startRow: number,
        bills: Array<Bill>
    ): { data: DataAccumulator; nextRow: number } {
        const regex = /^([A-Z_]+)\(([^)]+)\)$/;

        const readExpensesBlock = (
            bill: Bill,
            supplierList: Array<string>,
            currentRow: number,
            stopValue: string,
            parent?: DataAccumulator[number]
        ) => {
            const inner = (
                row: number,
                acc: DataAccumulator
            ): { expenses: typeof acc, nextRow: number } => {
                const cellValue = worksheet.getCell(row, 2).value?.toString().trim() || '';
                if (!cellValue || cellValue === stopValue) {
                    return { expenses: acc, nextRow: row };
                }
                const { data: bodyData, supplierList: suppliers } = this.buildCreditCardBodyData(
                    worksheet,
                    bill,
                    groupName,
                    row,
                    2,
                    !parent,
                    supplierList
                );

                if (suppliers?.length) {
                    supplierList.push(...suppliers);
                }
                const accNext = bodyData
                    ? [...acc, { ...bodyData, ...(parent ? { parent } : {}) }]
                    : acc;
                return inner(row + 1, accNext);
            };
            return inner(currentRow, []);
        };

        const processParentWithChildren = (
            data: DataAccumulator,
            initialRow: number,
            supplierList: Array<string>,
            bill: Bill
        ): number => {
            const recurse = (row: number): number => {
                const cell = worksheet.getCell(row, 2);
                const value = cell.value?.toString().trim() || '';
                if (cell.isMerged && (cell as any)['_mergeCount'] > 2) {
                    const parentName = `${groupName} ${value}`;
                    const parent = data.find((item) => item.name === parentName);
                    if (parent) {
                        const { expenses: children, nextRow } = readExpensesBlock(
                            bill,
                            supplierList,
                            row + 2,
                            '',
                            parent
                        );
                        if (children.length) parent.children = children;
                        return recurse(nextRow + 1); // Continua do próximo bloco
                    }
                }
                return row;
            };
            return recurse(initialRow);
        };

        const processBills = (
            row: number,
            acc: DataAccumulator
        ): { allBills: typeof acc, nextRow: number } => {
            const cell = worksheet.getCell(row, 2);
            const cellValue = cell.value?.toString().trim() || '';
            const match = cellValue.match(regex);
            if (!match) {
                return { allBills: acc, nextRow: row };
            }
            const billType = match[1] as EBillType;
            const bankName = match[2] || 'Bank';
            const billName = `${groupName} ${snakeCaseToNormal(billType)} ${bankName}`;
            const bill = bills.find((item) => item.name === billName);
            if (!bill) {
                return processBills(row + 1, acc);
            }
            const supplierList: Array<string> = [];
            const { expenses: data, nextRow } = readExpensesBlock(
                bill,
                supplierList,
                row + 2,
                'TOTAL'
            );
            const afterParentRow = processParentWithChildren(data, nextRow + 2, supplierList, bill);
            return processBills(
                afterParentRow,
                [...acc, { ...bill, expenses: data }]
            );
        };

        const { allBills, nextRow } = processBills(startRow, []);

        const data: DataAccumulator = [];
        allBills.forEach((bill) => {
            if(bill['expenses']) {
                const items = bill['expenses'];
                if(Array.isArray(items)) {
                    data.push(...items);
                }
            }
        });

        return {
            data,
            nextRow: nextRow
        };
    }


    private buildCreditCardBodyData(worksheet: ExcelJS.Worksheet, bill: Bill, groupName: string, row: number, column: number, isParent: boolean = true, supplierList: Array<string> = []) {
        const filterTexts: Array<string> = [];
        filterTexts.push(bill.name);
        if(!isParent) {
            filterTexts.push(...supplierList);
        }

        const titleCellTable = worksheet.getCell(row, column);
        const titleCellTableValue = titleCellTable.value ? titleCellTable.value.toString().trim() : '';

        const name = `${groupName} ${titleCellTableValue}`;

        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = 0;
            acc[`${month}_paid`] = false;
            return acc;
        }, {} as CycleOfMonths);

        const supplier = cleanTextByListText(filterTexts, name);

        if(isParent) {
            supplierList = [supplier];
        }

        let nextColumn = column + 1;

        const bodyData = {
            ...monthsObj,
            year: bill.year,
            bill,
            name,
            supplier,
            is_aggregate: !isParent,
            aggregate_name: cleanTextByListText([bill.name, supplier], name) ?? 'FUCK',
        }

        MONTHS.forEach((month) => {
            const monthCell = worksheet.getCell(row, nextColumn);
            const monthCellValue = monthCell.value ? monthCell.value.toString().trim() : '0';
            bodyData[month] = Number(monthCellValue);
            nextColumn++;
        });

        const paidCell = worksheet.getCell(row, nextColumn);
        const paidCellValue = paidCell.value ? paidCell.value.toString().trim() : 'NO';
        bodyData['paid'] = paidCellValue === 'YES';

        MONTHS.forEach((month) => {
            bodyData[`${month}_paid`] = bodyData['paid'];
        });
        nextColumn++;
        const totalCell = worksheet.getCell(row, nextColumn);
        const totalCellValue = totalCell.value ? totalCell.value.toString().trim() : '0';
        bodyData['total'] = Number(totalCellValue) || 0;

        return { data: bodyData, supplierList: !isParent ? [] : supplierList };
    }
}
