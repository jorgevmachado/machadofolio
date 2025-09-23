import {
    type CycleOfMonths,
    DEFAULT_TABLES_PARAMS,
    MONTHS,
    type TablesParams,
    cleanTextByListText,
    getCurrentMonth,
    getMonthByIndex,
    getMonthIndex,
    isMonthValid,
    snakeCaseToNormal, TMonth, getCurrentMonthNumber
} from '@repo/services';

import { EBillType, EExpenseType } from '../../../api';

import type { ExpenseEntity, InitializedExpense } from '../types';
import type Expense from '../expense';

import type {
    AccumulateGroupTables,
    AccumulateGroupTablesParams,
    AllExpensesCalculated,
    BuildCreditCardBodyData,
    BuildCreditCardBodyDataParams,
    BuildDetailData,
    BuildDetailDataParams,
    BuildGroupTable,
    BuildGroupTableParams,
    DataAccumulator,
    GenerateCreditCardTable,
    GenerateCreditCardTableParams,
    GenerateDetailsTable,
    GenerateDetailsTableParams,
    ParseToDetailsTable,
    ParseToDetailsTableParams,
} from './types';

import type { Bill } from '../../bill';

export default class ExpenseBusiness {
    public initialize(expense: Expense, month?: ExpenseEntity['month']): InitializedExpense {
        return expense.type === EExpenseType.FIXED
            ? this.handleFixedExpense(expense)
            : this.handleVariableExpense(expense, month);
    }

    public reinitialize(months: Array<TMonth>, expense: Expense, existingExpense?: Expense): Expense {
        if (!existingExpense) {
            return expense;
        }
        months.forEach(month => {
            const existingCurrentMonth = existingExpense.months.find(m => m.label === month);
            const currentMonth = expense.months.find(m => m.label === month);
            if(existingCurrentMonth && currentMonth) {
                existingCurrentMonth.value += currentMonth.value;
                existingCurrentMonth.paid = currentMonth.paid;
                const existingCurrentMonthIndex = existingExpense.months.findIndex(m => m.label === month);
                existingExpense.months[existingCurrentMonthIndex] = existingCurrentMonth;
            }
        });

        existingExpense.type = expense.type;
        existingExpense.instalment_number = expense.instalment_number;

        return existingExpense;
    }

    private handleFixedExpense(expense: Expense): InitializedExpense {
        return {
            nextYear: expense.year + 1,
            requiresNewBill: false,
            expenseForNextYear: undefined,
            monthsForCurrentYear: MONTHS,
            expenseForCurrentYear: { ...expense, instalment_number: 12 },
        };
    }

    private handleVariableExpense(expense: Expense, month?: ExpenseEntity['month']): InitializedExpense {
        const startMonth = month ?? getCurrentMonth();
        isMonthValid(startMonth);
        const startMonthIndex = getMonthIndex(startMonth?.toUpperCase() as ExpenseEntity['month']);
        const {
            monthsForCurrentYear,
            monthsForNextYear
        } = this.splitMonthsByYear(expense.year, expense.instalment_number, startMonthIndex);

        const result: InitializedExpense = {
            nextYear: expense.year + 1,
            requiresNewBill: monthsForNextYear.length > 0,
            monthsForNextYear,
            expenseForNextYear: undefined,
            monthsForCurrentYear,
            expenseForCurrentYear: { ...expense, instalment_number: monthsForCurrentYear.length  },
        };

        if (result.requiresNewBill) {
            result.expenseForNextYear = { ...expense, id: '', year: result.nextYear, instalment_number: monthsForNextYear.length };
        }
        return result;
    }

    private splitMonthsByYear(currentYear: number, instalments: number, startMonthIndex: number) {
        const monthsForCurrentYear: Array<TMonth> = [];
        const monthsForNextYear: Array<TMonth> = [];

        for (let i = 0; i < instalments; i++) {
            const monthIndex = (startMonthIndex + i) % 12;
            const year = currentYear + Math.floor((startMonthIndex + i) / 12);

            if (year === currentYear) {
                monthsForCurrentYear.push(getMonthByIndex(monthIndex));
            } else {
                monthsForNextYear.push(getMonthByIndex(monthIndex));
            }
        }

        return { monthsForCurrentYear, monthsForNextYear };
    }

    public calculate(expense: Expense): Expense {
        const builtExpense = { ...expense };
        const months = expense.months;
        builtExpense.paid = months.every(month => month.paid === true);
        const total = months.reduce((acc, item) => acc + item.value, 0);
        const total_paid = months.reduce((acc, item) => acc + (item.paid ? item.value : 0), 0);
        builtExpense.total = Number(total.toFixed(2));
        builtExpense.total_paid = Number(total_paid.toFixed(2));
        return builtExpense;
    }

    public buildTablesParams(expenses: Array<Expense> = [], tableWidth: number, headers: Array<string> = ['month', 'value', 'paid']): TablesParams {
        const tables: TablesParams['tables'] = [];

        expenses.forEach((expense) => {
            const monthlyData = expense.months.map((month) => ({
                month: month.label,
                value: month.value,
                paid: month.paid,
            }));
            const body = {
                title: expense?.supplier?.name || 'expense',
                data: monthlyData
            };
            tables.push(body);
        });

        return {
            ...DEFAULT_TABLES_PARAMS,
            tables,
            headers,
            tableWidth,
            tableDataRows: MONTHS.length,
        };
    }

    public totalByMonth(month: string, expenses: Array<Expense> = []): number {
        return expenses.reduce((sum, expense) => {
            const code = getCurrentMonthNumber(month)
            const foundMonth = expense.months?.find(m => m.code === code);
            return sum + (foundMonth?.value || 0);
        }, 0);
    }

    public allHaveBeenPaid(expenses: Array<Expense> = []): boolean {
        if (expenses.length === 0) {
            return false;
        }
        return expenses.every(expense => expense && expense.paid === true);
    }

    public parseToDetailsTable({
                                   bills,
                                   startRow,
                                   groupName,
                                   workSheet
                               }: ParseToDetailsTableParams): ParseToDetailsTable {
        const secondaryBillList = bills.filter((bill) => bill.type !== EBillType.CREDIT_CARD);
        const creditCardBillList = bills.filter((bill) => bill.type === EBillType.CREDIT_CARD);
        const expensesData: ParseToDetailsTable = [];

        const { data: secondaryTableList, nextRow: secondaryTableListNextRow } = this.generateDetailsTable({
            bills: secondaryBillList,
            startRow,
            workSheet
        });

        if (secondaryTableListNextRow !== startRow) {
            expensesData.push(...secondaryTableList);
        }

        const { data: creditCardTableList, nextRow: creditCardTableListNextRow } = this.generateCreditCardTable({
            bills: creditCardBillList,
            groupName,
            startRow: secondaryTableListNextRow,
            workSheet
        });

        if (creditCardTableListNextRow !== secondaryTableListNextRow) {
            expensesData.push(...creditCardTableList);
        }

        return expensesData;

    }

    private generateDetailsTable({ bills, startRow, workSheet }: GenerateDetailsTableParams): GenerateDetailsTable {
        const billTypeMap = new Map(bills.map(bill => [bill.type, bill]));
        const collectGroupsRecursively = (row: number, acc: DataAccumulator): {
            data: DataAccumulator;
            nextRow: number
        } => {
            const cell = workSheet.cell(row, 3);
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
        if (constructedGroupTable.hasNext) {
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
        const tableCell1 = workSheet.cell(row, 3);
        if (tableCell1.isMerged && tableCell1['_mergeCount'] === 2) {
            const groupTableData: Array<Record<string, string | number | boolean | object | Bill>> = [];
            const groupTableRow = row + 2;
            const groupTable1Data1 = this.buildDetailData({
                row: groupTableRow,
                cell: tableCell1,
                bill,
                column: 4,
                workSheet,
            });
            if (groupTable1Data1) {
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
            if (groupTable1Data2) {
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
            if (groupTable1Data3) {
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
        if (title === '') {
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


    private generateCreditCardTable({
                                        bills,
                                        startRow,
                                        groupName,
                                        workSheet
                                    }: GenerateCreditCardTableParams): GenerateCreditCardTable {
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
                const cell = workSheet.cell(row, 2);
                const cellValue = cell.value?.toString().trim() || '';

                if (!cellValue || cellValue === stopValue) {
                    return { expenses: acc, nextRow: row };
                }

                const { data: bodyData, supplierList: suppliers } = this.buildCreditCardBodyData({
                    row,
                    bill,
                    column: 2,
                    isParent: !parent,
                    groupName,
                    workSheet,
                    supplierList
                });

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
                const cell = workSheet.cell(row, 2);
                const value = cell.value?.toString().trim() || '';
                if (cell.isMerged && cell['_mergeCount'] > 2) {

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
                        return recurse(nextRow + 1);
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
            const cell = workSheet.cell(row, 2);
            const cellValue = cell.value?.toString().trim() || '';
            const match = cellValue.match(regex);

            if (!match) {
                return { allBills: acc, nextRow: row };
            }


            const billType = match[1] as EBillType;

            const bankName = match?.[2] || 'Bank';

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
            if (bill['expenses']) {
                const items = bill['expenses'];
                if (Array.isArray(items)) {
                    data.push(...items);
                }
            }
        });

        return {
            data,
            nextRow: nextRow
        };
    }

    private buildCreditCardBodyData({
                                        row,
                                        bill,
                                        column,
                                        isParent = true,
                                        groupName,
                                        workSheet,
                                        supplierList = []
                                    }: BuildCreditCardBodyDataParams): BuildCreditCardBodyData {
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

    public calculateAll(expenses: Array<Expense> = []): AllExpensesCalculated {
        const total = expenses.reduce((acc, expense) => acc + expense.total, 0);
        const allPaid = expenses.every((expense) => expense.paid);
        const totalPaid = expenses.reduce((acc, expense) => acc + (expense.paid ? expense.total : 0), 0);
        const totalPending = total - totalPaid;
        return { total, allPaid, totalPaid, totalPending };
    }
}