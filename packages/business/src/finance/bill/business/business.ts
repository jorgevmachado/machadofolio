import {
    type CycleOfMonths,
    MONTHS,
    ECellType,
    type TableParams,
    totalByMonth,
    snakeCaseToNormal,
    cleanTextByListText,
} from '@repo/services';

import type { Expense } from '../../expense';

import type Bill from '../bill';

import {
    BillList,
    type BodyData,
    type BuildBodyDataParams,
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

    public mapBillListByFilter(bills: Array<Bill>, type: BillList['type']): Array<BillList> {
        return bills.reduce<Array<BillList>>((groupedBills, currentBill) => {
            const title = this.getItemTitle(currentBill, type);
            let item = groupedBills.find((item) => item.title === title);
            if(!item) {
                item = { title, list: [], type};
                groupedBills.push(item);
            }
            item.list.push(currentBill);
            return groupedBills;
        }, []);
    }

    private getItemTitle(bill: Bill, type: BillList['type']): string {
        switch (type) {
            case 'bank':
                return bill.bank.name;
            case 'type':
                return bill.type.toLowerCase().replace(/ /g, '_');
            case 'group':
            default:
                return bill.group.name;
        }
    }

}