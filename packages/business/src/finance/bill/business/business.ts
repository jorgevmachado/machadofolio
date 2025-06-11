import { cleanTextByListText } from '@repo/services/string/string';

import { MONTHS } from '@repo/services/date/month/month';

import { DEFAULT_TABLE_PARAMS, DEFAULT_TITLE_STYLES } from '@repo/services/spreadsheet/table/constants';
import type { TableParams } from '@repo/services/spreadsheet/table/types';

import type Expense from '../../expense';

import type Bill from '../bill';

import type {
    BodyData,
    BuildBodyDataParams,
    GroupTables,
    ProcessingSpreadSheetCreditCardExpenseTableParams,
    ProcessingSpreadsheetBasicExpenseTableParams,
    ProcessingSpreadsheetTableParams,
    SpreadsheetProcessingParams
} from './types';
import { DEFAULT_BODY_DATA } from './config';
import { EBillType } from '../enum';


export default class BillBusiness {

    calculate(bill: Bill): Bill {
        if (bill?.expenses?.length) {
            bill.total = this.sumTotalExpenses(bill.expenses, 'total');
            bill.total_paid = this.sumTotalExpenses(bill.expenses, 'total_paid');
            bill.all_paid = bill.expenses.every((expense) => expense.paid);
        }
        return bill;
    }

    spreadsheetProcessing({
                              sheet,
                              bills = [],
                              startRow = 14,
                              isAllPaid,
                              tableWidth = 3,
                              groupsName = [],
                              startColumn = 2,
                              totalByMonth,
                              totalPaidByMonth,
                              buildExpensesTablesParams
                          }: SpreadsheetProcessingParams): void {

        if (!bills?.length) {
            return;
        }

        const headers: Array<string> = ['title', ...MONTHS, 'paid', 'total'];

        const secondStartRow = this.processingSpreadsheetTable({
            bills,
            sheet,
            headers,
            startRow,
            isAllPaid,
            groupsName,
            startColumn,
            totalByMonth,
            totalPaidByMonth
        });

        const thirdStartRow = this.processingSpreadsheetBasicExpenseTable({
            bills,
            sheet,
            startRow: secondStartRow,
            tableWidth,
            buildExpensesTablesParams
        });

        this.processingSpreadSheetCreditCardExpenseTable({
            bills,
            sheet,
            headers,
            startRow: thirdStartRow,
            isAllPaid,
            groupsName,
            tableWidth,
            startColumn,
            totalByMonth,
            totalPaidByMonth,
            buildExpensesTablesParams
        });
    }

    private processingSpreadsheetTable(params: ProcessingSpreadsheetTableParams) {
        const { bills, sheet, headers, startRow, isAllPaid, groupsName, startColumn, totalByMonth, totalPaidByMonth } = params;

        if (!bills?.length) {
            return startRow;
        }

        const tableBodyData = bills.map((bill) => this.buildBodyData({
            title: bill.name,
            expenses: bill.expenses,
            groupsName,
            isAllPaid,
            totalByMonth,
            totalPaidByMonth
        }));

        const tableParams: TableParams = {
            ...DEFAULT_TABLE_PARAMS,
            body: { ...DEFAULT_TABLE_PARAMS.body, list: tableBodyData },
            headers: { ...DEFAULT_TABLE_PARAMS.headers, list: headers },
            tableWidth: headers.length,
        };

        sheet.addTable({
            ...tableParams,
            startRow,
            startColumn,
        });

        return startRow + tableBodyData.length + 2;
    }

    private processingSpreadsheetBasicExpenseTable({
                                                       bills,
                                                       sheet,
                                                       startRow,
                                                       tableWidth,
                                                       buildExpensesTablesParams
                                                   }: ProcessingSpreadsheetBasicExpenseTableParams) {
        if (!bills?.length) {
            return startRow;
        }
        const basicExpenses = bills
            .filter(bill => bill.type !== EBillType.CREDIT_CARD)
            .flatMap(bill => bill.expenses ?? []);
        const basicExpensesTables = buildExpensesTablesParams(basicExpenses, tableWidth);

        sheet.addTables({
            ...basicExpensesTables,
            firstTableRow: startRow
        });

        return sheet.calculateTablesParamsNextRow({
            spaceTop: 1,
            startRow: startRow,
            tableWidth,
            totalTables: basicExpensesTables.tables.length,
            linesPerTable: MONTHS.length + 2,
            spaceBottomPerLine: 1,
        });
    }

    private processingSpreadSheetCreditCardExpenseTable(params: ProcessingSpreadSheetCreditCardExpenseTableParams) {
        const {
            bills,
            sheet,
            headers,
            groupsName,
            startRow,
            isAllPaid,
            tableWidth,
            startColumn,
            totalByMonth,
            buildExpensesTablesParams,
            totalPaidByMonth
        } = params;
        if (!bills?.length) {
            return;
        }

        const groupTablesExpenses: Array<GroupTables> = bills
            .filter(bill => bill.type === EBillType.CREDIT_CARD)
            .map(bill => {
                const tableBodyData = (bill.expenses ?? [])
                    .filter(expense => !expense.is_aggregate)
                    .map(expense => {
                        const bodyData = this.buildBodyData({
                            title: expense.name,
                            expense,
                            isAllPaid,
                            groupsName,
                            totalByMonth,
                            totalPaidByMonth
                        });
                        const children = expense.children ?? [];
                        const childrenTables = (children ?? []).length
                            ? buildExpensesTablesParams(children, tableWidth)
                            : null;

                        return { bodyData, childrenTables, title: expense.name };
                    });

                const list = tableBodyData.map(item => item.bodyData);
                const groupTablesParams = tableBodyData
                    .filter(item => !!item.childrenTables)
                    .map(item => ({
                        title: item.title,
                        tablesParams: item.childrenTables
                    }));

                return {
                    tableParams: {
                        ...DEFAULT_TABLE_PARAMS,
                        body: { ...DEFAULT_TABLE_PARAMS.body, list },
                        headers: { ...DEFAULT_TABLE_PARAMS.headers, list: headers },
                        title: {
                            value: cleanTextByListText(groupsName, bill.name),
                            styles: DEFAULT_TITLE_STYLES
                        },
                        tableWidth: headers.length
                    },
                    groupTablesParams
                } as GroupTables;
            });

        groupTablesExpenses.reduce((rowAcc, groupTable) => {
            const { tableParams, groupTablesParams } = groupTable;
            sheet.addTable({
                ...tableParams,
                startRow: rowAcc,
                startColumn,
            });

            const tableHeight = sheet.calculateTableHeight({ total: tableParams?.body?.list?.length });
            const afterMainTableRow = rowAcc + tableHeight + 2;

            return (groupTablesParams ?? []).reduce((row, group) => {
                const hasTitle = !!group.title;
                if (group.title) {
                    sheet.cell.add({
                        cell: row + 1,
                        cellColumn: 2,
                        value: group.title,
                        styles: {
                            font: { bold: true },
                            alignment: { wrapText: false },
                            borderStyle: 'medium',
                            fillColor: 'FFFFFF'
                        },
                        merge: {
                            positions: {
                                startRow: row + 1,
                                startColumn: 2,
                                endRow: row + 1,
                                endColumn: 16
                            }
                        }
                    });
                }
                const firstTableRow = hasTitle ? row + 2 : row + 1;

                sheet.addTables({
                    ...group.tablesParams,
                    firstTableRow
                });

                return sheet.calculateTablesParamsNextRow({
                    spaceTop: 1,
                    startRow: row,
                    tableWidth,
                    totalTables: group.tablesParams.tables.length,
                    linesPerTable: MONTHS.length + (hasTitle ? 2 : 1),
                    spaceBottomPerLine: 1,
                });
            }, afterMainTableRow);
        }, startRow);
    }

    private buildBodyData({
                              title,
                              expense,
                              expenses = [],
                              isAllPaid,
                              groupsName = [],
                              totalByMonth,
                              totalPaidByMonth
                          }: BuildBodyDataParams): BodyData {
        const bodyData: BodyData = { ...DEFAULT_BODY_DATA };
        bodyData.title = cleanTextByListText(groupsName, title);
        bodyData.paid = !expense ? totalPaidByMonth(expenses) : isAllPaid(expense);
        MONTHS.forEach((month) => {
            bodyData[month] = !expense ? totalByMonth(month, expenses) : expense[month];
        });
        bodyData.total = MONTHS.reduce((sum, month) => sum + (Number(bodyData[month]) || 0), 0);
        return bodyData;
    }

    private sumTotalExpenses(expenses: Array<Expense>, property: 'total' | 'total_paid'): number {
        return expenses.reduce((acc, expense) => acc + (expense[property] ?? 0), 0);
    }
}