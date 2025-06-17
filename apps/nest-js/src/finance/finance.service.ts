import * as ExcelJS from 'exceljs';

import { toSnakeCase } from '@repo/services/string/string';

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

    // async initializeWithDocument(file: Express.Multer.File, user: User) {
    //     if (!file?.buffer) {
    //         throw new Error('Arquivo não enviado ou inválido.');
    //     }
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.load(file.buffer);
    //
    //     const worksheet = workbook.worksheets[0];
    //     if (!worksheet) {
    //         throw new Error('O arquivo Excel não contém nenhuma planilha.');
    //     }
    //
    //     const headerRowNumber = 14;
    //     const headerRow = worksheet.getRow(headerRowNumber);
    //
    //     if (!headerRow) {
    //         throw new Error('Cabeçalho ausente na planilha.');
    //     }
    //
    //     const headerMap: { [col: number]: keyof SpreadsheetTable } = {};
    //     headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    //         const header = String(cell.value).trim().toLowerCase();
    //         // Relacionamento defensivo para prevenir erros de capitalização
    //         switch (header) {
    //             case 'title': headerMap[colNumber] = 'title'; break;
    //             case 'january': headerMap[colNumber] = 'january'; break;
    //             case 'february': headerMap[colNumber] = 'february'; break;
    //             case 'march': headerMap[colNumber] = 'march'; break;
    //             case 'april': headerMap[colNumber] = 'april'; break;
    //             case 'may': headerMap[colNumber] = 'may'; break;
    //             case 'june': headerMap[colNumber] = 'june'; break;
    //             case 'july': headerMap[colNumber] = 'july'; break;
    //             case 'august': headerMap[colNumber] = 'august'; break;
    //             case 'september': headerMap[colNumber] = 'september'; break;
    //             case 'october': headerMap[colNumber] = 'october'; break;
    //             case 'november': headerMap[colNumber] = 'november'; break;
    //             case 'december': headerMap[colNumber] = 'december'; break;
    //             case 'paid': headerMap[colNumber] = 'paid'; break;
    //             case 'total': headerMap[colNumber] = 'total'; break;
    //             // Adicione outras opções conforme necessário
    //         }
    //     });
    //
    //     const data: SpreadsheetTable[] = [];
    //
    //     for (
    //         let rowNumber = headerRowNumber + 1;
    //         rowNumber <= worksheet.rowCount;
    //         rowNumber++
    //     ) {
    //         const row = worksheet.getRow(rowNumber);
    //         if (!row) break;
    //
    //         let rowIsEmpty = true;
    //         const obj: Partial<SpreadsheetTable> = {};
    //
    //         for (const col in headerMap) {
    //             const colNum = parseInt(col, 10);
    //             const key = headerMap[colNum];
    //             const value = row.getCell(colNum).value;
    //
    //             if (value !== null && value !== undefined && value !== '') {
    //                 rowIsEmpty = false;
    //             }
    //             if(key) {
    //                 obj[key] = (typeof value === 'object' && value !== null && 'result' in value) ? (value as any).result : value ?? '';
    //             }
    //         }
    //
    //         if (rowIsEmpty) break;
    //
    //         // Faz um cast porque testamos todos os campos no começo.
    //         data.push(obj as SpreadsheetTable);
    //     }
    //
    //     return data;
    //
    // }

    async initializeWithDocument(file: Express.Multer.File, user: User) {
        if (!file?.buffer) {
            throw new Error('Arquivo não enviado ou inválido.');
        }

        const finance = await this.initialize(user) as Finance;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new Error('O arquivo Excel não contém nenhuma planilha.');
        }

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
        console.log('# => titleNextRow => ', titleNextRow);

        const summaryTableCell = worksheet.getCell('B14');
        const summaryTableCellValue = summaryTableCell.value ? summaryTableCell.value.toString().trim() : '';
        const summaryTableCellValueNextRow = Number(summaryTableCell.row) + 1;
        const bills: Array<Bill> = [];
        if(summaryTableCellValue === 'Summary') {
            const summaryTableHeaderCellRow = worksheet.getRow(summaryTableCellValueNextRow);
            const tableHeader = ['title', 'bank', ...MONTHS, 'paid', 'total'];
            const filterTitle = ['TOTAL'];
            const { data, nextRow } = this.generateObjList(summaryTableHeaderCellRow, worksheet, titleNextRow, filterTitle, tableHeader)

            console.log('# => nextRow => ', nextRow)

            for(const item of data) {
                const title = !item['title'] ? '' : item['title'].toString();

                const bank = await this.bankService.createToSheet(item['bank']?.toString()) as Bank;
                const group = await this.groupService.createToSheet(finance, groupName) as Group;

                const bill = await this.billService.createToSheet({
                    type: toSnakeCase(title).toUpperCase() as EBillType,
                    year,
                    bank,
                    group,
                    finance
                }) as Bill;

                bills.push(bill);
            }

            const { data: detailsTable, nextRow: detailsTableNextRow } = this.generateDetailsTable(worksheet, nextRow, bills);
            console.log('# => detailsTable => ', detailsTable.length);
            console.log('# => detailsTableNextRow => ', detailsTableNextRow);
        }
    }


    private generateObjList(row: ExcelJS.Row, worksheet: ExcelJS.Worksheet, startRow: number, ignoreTitles: Array<string> = [], header: Array<string> = []) {
        console.log('# => startRow => ', startRow);
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
            const titleField = normalizedHeader.find(h => h === 'title');
            const itemTitle = titleField && typeof item[titleField] === 'string'
                ? item[titleField].trim().toLowerCase()
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
            name: title,
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
            const groupTableData: Array<Record<string, string | number | boolean | Bill>> = [];
            const groupTableRow = row + 1;
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
        const data: Array<Record<string, string | number | boolean | Bill>> = [];
        const cell = worksheet.getCell(startRow, 3);
        const type = cell.value ? cell.value.toString().trim() : '';
        let nextRow = Number(cell.row) + 1;

        if(type === EBillType.BANK_SLIP || type === EBillType.PIX || type === EBillType.ACCOUNT_DEBIT) {
            const bill = bills.find((bill) => bill.type === type);
            if(bill) {
                const { data: groupTable1, nextRow: groupTable1Row, hasNext: grouTable1HasNext } = this.buildGroupTable(
                    worksheet,
                    nextRow,
                    bill
                )
                if(grouTable1HasNext) {
                    nextRow = groupTable1Row;
                    data.push(...groupTable1);
                    const { data: groupTable2, nextRow: groupTable2Row, hasNext: groupTable2HasNext } = this.buildGroupTable(
                        worksheet,
                        nextRow,
                        bill
                    );
                    if(groupTable2HasNext) {
                        nextRow = groupTable2Row;
                        data.push(...groupTable2);
                        const { data: groupTable3, nextRow: groupTable3Row, hasNext: groupTable3HasNext } = this.buildGroupTable(
                            worksheet,
                            nextRow,
                            bill
                        );
                        if(groupTable3HasNext) {
                            nextRow = groupTable3Row;
                            data.push(...groupTable3);
                        }
                    }
                }
            }
        }
        return { data, nextRow: nextRow };
    }


}
