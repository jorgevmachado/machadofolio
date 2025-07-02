import { type CycleOfMonths, MONTHS, totalByMonth } from '@repo/services/date/month/month';
import { cleanTextByListText, snakeCaseToNormal } from '@repo/services/string/string';


import { ECellType } from '@repo/services/spreadsheet/worksheet/enum';
import type { TableParams } from '@repo/services/spreadsheet/table/types';

import type Expense from '../../expense';

import type Bill from '../bill';
import { type EBillType } from '../enum';

import {
    type AccumulateGroupTables, type AccumulateGroupTablesParams,
    type BodyData,
    type BuildBodyDataParams, type BuildCreditCardBodyDataParams,
    type BuildDetailData,
    type BuildDetailDataParams,
    type BuildGroupTable,
    type BuildGroupTableParams, type DataAccumulator, type GenerateDetailsTable, type GenerateDetailsTableParams,
    type GetWorkSheetTitle,
    type GetWorkSheetTitleParams,
    type ProcessingSpreadsheetDetailTableParams,
    type ProcessingSpreadsheetSecondaryTablesParams,
    type ProcessingSpreadsheetTableParams,
    type SpreadsheetProcessingParams,
} from './types';

export default class BillBusiness {

    public calculate(bill: Bill): Bill {
        if (bill?.expenses?.length) {
            bill.total = this.sumTotalExpenses(bill.expenses, 'total');
            bill.total_paid = this.sumTotalExpenses(bill.expenses, 'total_paid');
            bill.all_paid = bill.expenses.every((expense) => expense.paid);
        }
        return bill;
    }

    public spreadsheetProcessing({
                                     summary = true,
                                     startRow = 14,
                                     tableWidth = 3,
                                     groupsName = [],
                                     tableHeader = ['title', ...MONTHS, 'paid', 'total'],
                                     startColumn = 2,
                                     summaryTitle = 'Summary',
                                     detailTables = [],
                                     detailTablesHeader = ['month', 'value', 'paid'],
                                     summaryTableHeader = ['title', 'bank', ...MONTHS, 'paid', 'total'],
                                     ...params
                                 }: SpreadsheetProcessingParams): number {
        const { data, sheet, groupName, allExpensesHaveBeenPaid, buildExpensesTablesParams } = params;
        sheet.createWorkSheet(groupName);

        sheet.workSheet.addCell({
            cell: 'B2',
            type: ECellType.TITLE,
            value: `${groupName}(${params.year})`,
            merge: { cellStart: 'B2', cellEnd: 'Q11' }
        });

        const initialRow = summary
            ? this.processingSpreadsheetTable({
                sheet,
                startRow,
                startColumn,
                table: {
                    data: data.map((item) => ({
                        type: snakeCaseToNormal(item.type),
                        bank: item.bank.name,
                        list: item.expenses ?? []
                    })),
                    title: summaryTitle,
                    footer: true,
                    header: summaryTableHeader,
                },
                buildBodyDataMap: (data) => ({
                    data: !data.item ? data.list : data.item,
                    bank: data.bank,
                    type: data.type,
                    arrFunction: allExpensesHaveBeenPaid
                }),
                buildFooterData: (data) => {
                    const monthsObj = MONTHS.reduce((acc, month) => {
                        acc[month] = totalByMonth(month, data);
                        return acc;
                    }, {} as CycleOfMonths);
                    return {
                        paid: data.every(item => item && item.paid),
                        footer: true,
                        type: 'TOTAL',
                        ...monthsObj,
                        total: data.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                    };
                }
            })
            : startRow;

        return this.processingSpreadsheetSecondaryTables({
            data,
            sheet,
            startRow: initialRow,
            tableWidth,
            groupsName,
            tableHeader,
            startColumn,
            detailTables,
            detailTablesHeader,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        });
    }

    private processingSpreadsheetTable(params: ProcessingSpreadsheetTableParams<Expense>): number {
        const { sheet, table, startRow, startColumn, buildBodyDataMap, buildFooterData } = params;

        if (!table) {
            return startRow;
        }

        const { title, data = [], header, footer } = table;

        const tableBodyData = data.map((body) => this.buildBodyData<Expense>(buildBodyDataMap(body)));


        if (!tableBodyData.length) {
            return startRow;
        }

        const tableParams: TableParams = {
            body: { list: tableBodyData },
            title: !title ? undefined : { value: title },
            headers: { list: header },
            startRow: startRow,
            tableWidth: header.length,
            startColumn
        };

        if (footer && buildFooterData) {
            tableParams.footer = buildFooterData(tableBodyData);
        }

        const positions = sheet.addTable(tableParams);


        return positions.nextRow + 1;
    }

    private processingSpreadsheetSecondaryTables(params: ProcessingSpreadsheetSecondaryTablesParams): number {
        const {
            data,
            sheet,
            startRow,
            tableWidth,
            groupsName,
            tableHeader,
            startColumn,
            detailTables,
            detailTablesHeader,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        } = params;
        return detailTables?.reduce((currentRow, type) => {
            const currentData = data.filter((item) => item.type === type);

            if (type !== 'CREDIT_CARD') {
                return this.processingSpreadsheetDetailTable({
                    sheet,
                    table: {
                        data: currentData.map((data) => ({
                            title: cleanTextByListText(groupsName, data.name),
                            list: data.expenses ?? []
                        })),
                        title: type,
                        header: detailTablesHeader,
                    },
                    startRow: currentRow,
                    tableWidth,
                    detailTablesHeader,
                    buildExpensesTablesParams
                });
            }

            return currentData.reduce((row, data) => {
                const expenses = data.expenses ?? [];
                const parentExpenses = expenses.filter((expense) => !expense.is_aggregate);

                const rowAfterParent = !parentExpenses.length ? row : this.processingSpreadsheetTable({
                    sheet,
                    startRow: row,
                    startColumn,
                    table: {
                        data: parentExpenses.map((parent) => ({
                            title: cleanTextByListText(groupsName, parent.name),
                            list: [],
                            item: parent
                        })),
                        title: `${data.type}(${data.bank.name})`,
                        footer: true,
                        header: tableHeader,
                    },
                    buildBodyDataMap: (data) => ({
                        data: !data.item ? data.list : data.item,
                        bank: data.bank,
                        title: data.title,
                        arrFunction: allExpensesHaveBeenPaid
                    }),
                    buildFooterData: (data) => {
                        const monthsObj = MONTHS.reduce((acc, month) => {
                            acc[month] = totalByMonth(month, data);
                            return acc;
                        }, {} as CycleOfMonths);
                        return {
                            paid: data.every(item => item && item.paid),
                            footer: true,
                            title: 'TOTAL',
                            ...monthsObj,
                            total: data.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                        };
                    }
                });
                return parentExpenses.reduce((parentRow, parent) => {
                    const childrenExpenses = parent.children ?? [];
                    return !childrenExpenses.length ? parentRow : this.processingSpreadsheetTable({
                        sheet,
                        startRow: parentRow,
                        startColumn,
                        table: {
                            data: childrenExpenses.map((child) => ({
                                title: cleanTextByListText(groupsName, child.name),
                                list: [],
                                item: child
                            })),
                            title: cleanTextByListText(groupsName, parent.name),
                            footer: true,
                            header: tableHeader,
                        },
                        buildBodyDataMap: (data) => ({
                            data: !data.item ? data.list : data.item,
                            bank: data.bank,
                            title: data.title,
                            arrFunction: allExpensesHaveBeenPaid
                        }),
                    });
                }, rowAfterParent);
            }, currentRow);
        }, startRow);
    }

    private buildBodyData<T>({ data, arrFunction, ...params }: BuildBodyDataParams<T>): BodyData {
        const isDataArray = Array.isArray(data);
        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = isDataArray ? totalByMonth(month, data as Array<Record<string, unknown>>) : data[month];
            return acc;
        }, {} as CycleOfMonths);

        const bodyData: BodyData = {
            paid: isDataArray ? arrFunction(data) : data['paid'],
            ...params,
            ...monthsObj,
            total: 0
        };

        bodyData['total'] = MONTHS.reduce((sum, month) => sum + (Number(bodyData[month]) || 0), 0);
        return bodyData;
    }

    private processingSpreadsheetDetailTable(params: ProcessingSpreadsheetDetailTableParams): number {
        const { sheet, startRow, tableWidth, table, detailTablesHeader, buildExpensesTablesParams } = params;

        if (!table) {
            return startRow;
        }

        const { title, data = [] } = table;

        const expenses = data.flatMap(item => item.list ?? []);

        const expenseTables = buildExpensesTablesParams(expenses, tableWidth, detailTablesHeader);

        if (!expenseTables.tables.length) {
            return startRow;
        }

        const positions = sheet.addTables({
            ...expenseTables,
            blockTitle: !title ? undefined : title,
            firstTableRow: startRow
        });

        return positions.nextRow + 1;
    }

    private sumTotalExpenses(expenses: Array<Expense>, property: 'total' | 'total_paid'): number {
        return expenses.reduce((acc, expense) => acc + (expense[property] ?? 0), 0);
    }


    public getWorkSheetTitle({
        row,
        merge = 10,
        column,
        topSpace = 1,
        workSheet,
        bottomSpace = 2,
    }: GetWorkSheetTitleParams): GetWorkSheetTitle {
        const cell = workSheet.cell(row, column);
        const text = cell.value ? cell.value.toString().trim() : '';
        const match = text.match(/^(.+?)\s*\((\d{4})\)$/);
        const currentYear = new Date().getFullYear();

        const title = {
            year: !match ? currentYear : Number(match[2]),
            name: !match ? text : match[1]?.trim() || text,
        };

        return {
            year: title.year,
            nextRow: merge + topSpace + bottomSpace + 1,
            groupName: title.name,
        };
    }

    public generateDetailsTable({ bills, startRow, workSheet }:GenerateDetailsTableParams): GenerateDetailsTable {
        const billTypeMap = new Map(bills.map(bill => [bill.type, bill]));
        const collectGroupsRecursively = (row: number, acc: DataAccumulator): { data: DataAccumulator; nextRow: number } => {
            const cell =  workSheet.cell(row, 3);
            const type = cell?.value ? cell?.value?.toString()?.trim() : '';

            if (!type) {
                return { data: acc, nextRow: row };
            }

            const bill = billTypeMap.get(type as EBillType);

            if (!bill) {
                return { data: acc, nextRow: row };
            }

            const { acc: filledAcc, lastRow } = this.accumulateGroupTables({
                acc,
                bill,
                startRow: row + 1,
                workSheet,
            });

            return collectGroupsRecursively(lastRow, filledAcc);
        };

        const { data, nextRow } = collectGroupsRecursively(startRow, []);

        return { data, nextRow };
    }

    private accumulateGroupTables({
        acc,
        bill,
        startRow,
        workSheet
    }: AccumulateGroupTablesParams): AccumulateGroupTables {
        const constructedGroupTable = this.buildGroupTable({
            row: startRow,
            bill,
            workSheet,
        });
        const updatedAcc = [...acc, ...constructedGroupTable.data];
        if(constructedGroupTable.hasNext) {
            return this.accumulateGroupTables({
                acc: updatedAcc,
                bill,
                startRow: constructedGroupTable.nextRow,
                workSheet
            });
        }
        return { acc: updatedAcc, lastRow: constructedGroupTable.nextRow };
    }

    private buildGroupTable({ row, bill, workSheet }: BuildGroupTableParams): BuildGroupTable {
        const tableCell1 =  workSheet.cell(row, 3);
        if(tableCell1.isMerged && tableCell1['_mergeCount'] === 2) {
            const groupTableData: Array<Record<string, string | number | boolean | object | Bill>> = [];
            const groupTableRow = row + 2;
            const groupTable1Data1 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell1,
                bill,
                column: 4,
                workSheet,
            });
            if(groupTable1Data1) {
                groupTableData.push(groupTable1Data1);
            }
            const tableCell2 = workSheet.cell(row, 8);
            const groupTable1Data2 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell2,
                bill,
                column: 9,
                workSheet,
            });
            if(groupTable1Data2) {
                groupTableData.push(groupTable1Data2);
            }

            const tableCell3 = workSheet.cell(row, 13);
            const groupTable1Data3 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell3,
                bill,
                column: 14,
                workSheet,
            });
            if(groupTable1Data3) {
                groupTableData.push(groupTable1Data3);
            }
            return { data: groupTableData, nextRow: row + 12 + 1 + 1 + 1, hasNext: true };
        }

        return { data: [], nextRow: row, hasNext: false };

    }

    private buildDetailData({
        row,
        cell,
        bill,
        column,
        workSheet,
    }: BuildDetailDataParams): BuildDetailData | undefined {
        const title = cell.value ? cell.value.toString().trim() : '';
        if(title === '') {
            return;
        }

        const bodyData = MONTHS.reduce((acc, month, index) => {
            const valueCell = workSheet.cell(row + index, column);
            const valueText = valueCell.value ? valueCell.value.toString().trim() : '0';
            const paidCell = workSheet.cell(row + index, column + 1);
            const paidText = paidCell.value ? paidCell.value.toString().trim() : 'NO';
            return {
                ...acc,
                [month]: Number(valueText),
                [`${month}_paid`]: paidText === 'YES'
            };
        }, {} as CycleOfMonths);

        return {
            ...bodyData,
            bill,
            supplier: title
        };
    }

    public buildCreditCardBodyData({
            row,
            bill,
            column,
            isParent = true,
            groupName,
            workSheet,
            supplierList = []
        }: BuildCreditCardBodyDataParams) {
        const filterTexts: Array<string> = [
            bill.name,
            ...(!isParent ? supplierList : [])
        ];

        const titleCellTable = workSheet.cell(row, column);
        const titleCellTableValue = titleCellTable.value ? titleCellTable.value.toString().trim() : '';

        const name = `${groupName} ${titleCellTableValue}`;

        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = 0;
            acc[`${month}_paid`] = false;
            return acc;
        }, {} as CycleOfMonths);

        const supplier = cleanTextByListText(filterTexts, name);

        const normalizedSupplierList = isParent ? [supplier] : [];

        const monthValues = MONTHS.map((month, index) => {
            const currentColumn = column + 1 + index;
            const monthCell = workSheet.cell(row, currentColumn);
            const monthCellValue = monthCell?.value ? monthCell?.value?.toString()?.trim() : '0';
            const monthCellValueNumber = Number(monthCellValue);
            return { [month]: Number.isNaN(monthCellValueNumber) ? 0 : monthCellValueNumber };
        });

        const paidColumn = column + 1 + MONTHS.length;
        const paidCell = workSheet.cell(row, paidColumn);
        const paidCellValue = paidCell?.value ? paidCell?.value?.toString()?.trim() : 'NO';
        const paid = paidCellValue === 'YES';

        const paidMonths = MONTHS.reduce((acc, month) => {
            acc[`${month}_paid`] = paid;
            return acc;
        }, {} as Record<string, boolean>);

        const totalColumn = paidColumn + 1;
        const totalCell = workSheet.cell(row, totalColumn);
        const totalCellValue = totalCell?.value ? totalCell?.value?.toString()?.trim() : '0';
        const total = Number(totalCellValue) || 0;

        const monthValuesObj = Object.assign({}, ...monthValues);

        const bodyData = {
            ...monthsObj,
            ...monthValuesObj,
            ...paidMonths,
            year: bill.year,
            bill,
            name,
            supplier,
            is_aggregate: !isParent,
            aggregate_name: cleanTextByListText([bill.name, supplier], name) ?? '',
            paid,
            total
        };

        return { data: bodyData, supplierList: normalizedSupplierList };
    }

}