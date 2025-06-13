import { type CycleOfMonths, MONTHS, totalByMonth } from '@repo/services/date/month/month';
import { cleanTextByListText } from '@repo/services/string/string';

import { ECellType } from '@repo/services/spreadsheet/cell/enum';
import type { TableParams } from '@repo/services/spreadsheet/table/types';


import type Expense from '../../expense';

import type Bill from '../bill';

import type {
    BodyData,
    BuildBodyDataParams,
    ProcessingSpreadsheetDetailTableParams,
    ProcessingSpreadsheetSecondaryTablesParams,
    ProcessingSpreadsheetTableParams,
    SpreadsheetProcessingParams
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
                                     startColumn = 2,
                                     summaryTitle = 'Summary',
                                     detailTables = [],
                                     ...params
                                 }: SpreadsheetProcessingParams): number {
        const tableHeader = ['title', ...MONTHS, 'paid', 'total'];

        const { data, sheet, groupName, allExpensesHaveBeenPaid, buildExpensesTablesParams } = params;

        sheet.createWorkSheet(groupName);

        sheet.cell.add({
            cell: 'B2',
            type: ECellType.TITLE,
            value: groupName,
            merge: { cellStart: 'B2', cellEnd: 'P11' }
        });

        const initialRow = summary
            ? this.processingSpreadsheetTable({
                sheet,
                startRow,
                startColumn,
                table: {
                    data: data.map((item) => ({
                        title: cleanTextByListText(groupsName, item.name),
                        list: item.expenses ?? []
                    })),
                    title: summaryTitle,
                    footer: true,
                    header: tableHeader,
                },
                allExpensesHaveBeenPaid
            })
            : startRow;

        return this.processingSpreadsheetSecondaryTables({
            data,
            sheet,
            startRow: initialRow,
            tableWidth,
            groupsName,
            startColumn,
            detailTables,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        });
    }

    private processingSpreadsheetTable(params: ProcessingSpreadsheetTableParams): number {
        const { sheet, table, startRow, startColumn, allExpensesHaveBeenPaid } = params;

        if (!table) {
            return startRow;
        }

        const { title, data = [], header, footer } = table;

        const tableBodyData = data.map((body) => this.buildBodyData<Expense>({
            data: !body.item ? body.list : body.item,
            title: body.title,
            allHaveBeenPaid: allExpensesHaveBeenPaid
        }));


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

        if (footer) {
            const monthsObj = MONTHS.reduce((acc, month) => {
                acc[month] = totalByMonth(month, tableBodyData);
                return acc;
            }, {} as CycleOfMonths);
            tableParams.footer = {
                paid: tableBodyData.every(item => item && item.paid),
                footer: true,
                title: 'TOTAL',
                ...monthsObj,
                total: tableBodyData.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
            };
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
            startColumn,
            detailTables,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        } = params;
        const header = ['title', ...MONTHS, 'paid', 'total'];
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
                        header: ['month', 'value', 'paid'],
                    },
                    startRow: currentRow,
                    tableWidth,
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
                        title: cleanTextByListText(groupsName, data.name),
                        footer: true,
                        header: header,
                    },
                    allExpensesHaveBeenPaid
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
                            header: header,
                        },
                        allExpensesHaveBeenPaid
                    });
                }, rowAfterParent);
            }, currentRow);
        }, startRow);
    }

    private buildBodyData<T>({ data, title, allHaveBeenPaid }: BuildBodyDataParams<T>): BodyData {
        const isDataArray = Array.isArray(data);
        const monthsObj = MONTHS.reduce((acc, month) => {
            acc[month] = isDataArray ? totalByMonth(month, data as Array<Record<string, unknown>>) : data[month];
            return acc;
        }, {} as CycleOfMonths);

        const bodyData: BodyData = {
            paid: isDataArray ? allHaveBeenPaid(data) : data['paid'],
            title: title,
            ...monthsObj,
            total: 0
        };

        bodyData['total'] = MONTHS.reduce((sum, month) => sum + (Number(bodyData[month]) || 0), 0);
        return bodyData;
    }

    private processingSpreadsheetDetailTable(params: ProcessingSpreadsheetDetailTableParams): number {
        const { sheet, startRow, tableWidth, table, buildExpensesTablesParams } = params;

        if (!table) {
            return startRow;
        }

        const { title, data = [] } = table;

        const expenses = data.flatMap(item => item.list ?? []);

        const expenseTables = buildExpensesTablesParams(expenses, tableWidth);

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
}