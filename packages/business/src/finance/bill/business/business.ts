import { cleanTextByListText } from '@repo/services/string/string';

import { MONTHS } from '@repo/services/date/month/month';

import { DEFAULT_TABLE_PARAMS, DEFAULT_TITLE_STYLES } from '@repo/services/spreadsheet/table/constants';
import type { TableParams } from '@repo/services/spreadsheet/table/types';

import type Expense from '../../expense';

import type Bill from '../bill';
import { EBillType } from '../enum';

import type {
    BodyData,
    BuildBodyDataParams,
    GroupTables,
    ProcessingSpreadSheetCreditCardExpenseTableParams,
    ProcessingSpreadsheetBasicExpenseTableParams,
    ProcessingSpreadsheetTableParams,
    SpreadsheetProcessingParams
} from './types';

const DEFAULT_BODY_DATA: BodyData =  {
    title: '',
    type: EBillType.CREDIT_CARD,
    january: 0,
    january_paid: false,
    february: 0,
    february_paid: false,
    march: 0,
    march_paid: false,
    april: 0,
    april_paid: false,
    may: 0,
    may_paid: false,
    june: 0,
    june_paid: false,
    july: 0,
    july_paid: false,
    august: 0,
    august_paid: false,
    september: 0,
    september_paid: false,
    october: 0,
    october_paid: false,
    november: 0,
    november_paid: false,
    december: 0,
    december_paid: false,
    total: 0,
    paid: false,
};

const DEFAULT_TABLE_HEADERS: Array<string> = ['title', ...MONTHS, 'paid', 'total'];

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
                              headers = DEFAULT_TABLE_HEADERS,
                              startRow = 14,
                              tableWidth = 3,
                              groupsName = [],
                              startColumn = 2,
                              totalExpenseByMonth,
                              allExpensesHaveBeenPaid,
                              buildExpensesTablesParams
                          }: SpreadsheetProcessingParams): void {

        if (!bills?.length) {
            return;
        }

        const secondStartRow = this.processingSpreadsheetTable({
            bills,
            sheet,
            headers,
            startRow,
            groupsName,
            startColumn,
            totalExpenseByMonth,
            allExpensesHaveBeenPaid
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
            groupsName,
            tableWidth,
            startColumn,
            totalExpenseByMonth,
            allExpensesHaveBeenPaid,
            buildExpensesTablesParams
        });
    }

    private processingSpreadsheetTable(params: ProcessingSpreadsheetTableParams) {
        const { bills, sheet, headers, startRow, groupsName, startColumn, totalExpenseByMonth, allExpensesHaveBeenPaid } = params;

        const tableBodyData = bills.map((bill) => this.buildBodyData({
            title: bill.name,
            expenses: bill.expenses,
            groupsName,
            totalExpenseByMonth,
            allExpensesHaveBeenPaid
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
            tableWidth,
            startColumn,
            totalExpenseByMonth,
            buildExpensesTablesParams,
            allExpensesHaveBeenPaid
        } = params;

        const groupTablesExpenses: Array<GroupTables> = bills
            .filter(bill => bill.type === EBillType.CREDIT_CARD)
            .map(bill => {
                const tableBodyData = (bill.expenses ?? [])
                    .filter(expense => !expense.is_aggregate)
                    .map(expense => {
                        const bodyData = this.buildBodyData({
                            title: expense.name,
                            expense,
                            groupsName,
                            totalExpenseByMonth,
                            allExpensesHaveBeenPaid
                        });
                        const children = expense.children ?? [];
                        const childrenTables = children.length
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
            const { tableParams, groupTablesParams = [] } = groupTable;
            sheet.addTable({
                ...tableParams,
                startRow: rowAcc,
                startColumn,
            });

            const tableHeight = sheet.calculateTableHeight({ total: tableParams?.body?.list?.length });
            const afterMainTableRow = rowAcc + tableHeight + 2;

            return groupTablesParams.reduce((row, group) => {
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
                const firstTableRow = row + 2;

                sheet.addTables({
                    ...group.tablesParams,
                    firstTableRow
                });

                return sheet.calculateTablesParamsNextRow({
                    spaceTop: 1,
                    startRow: row,
                    tableWidth,
                    totalTables: group.tablesParams.tables.length,
                    linesPerTable: MONTHS.length + 2,
                    spaceBottomPerLine: 1,
                });
            }, afterMainTableRow);
        }, startRow);
    }

    private buildBodyData({
                              title,
                              expense,
                              expenses = [],
                              groupsName = [],
                              totalExpenseByMonth,
                              allExpensesHaveBeenPaid
                          }: BuildBodyDataParams): BodyData {
        const bodyData: BodyData = { ...DEFAULT_BODY_DATA };
        bodyData.title = cleanTextByListText(groupsName, title);
        bodyData.paid = !expense ? allExpensesHaveBeenPaid(expenses) : expense.paid;
        MONTHS.forEach((month) => {
            bodyData[month] = !expense ? totalExpenseByMonth(month, expenses) : expense[month];
        });
        bodyData.total = MONTHS.reduce((sum, month) => sum + (Number(bodyData[month]) || 0), 0);
        return bodyData;
    }

    private sumTotalExpenses(expenses: Array<Expense>, property: 'total' | 'total_paid'): number {
        return expenses.reduce((acc, expense) => acc + (expense[property] ?? 0), 0);
    }
}