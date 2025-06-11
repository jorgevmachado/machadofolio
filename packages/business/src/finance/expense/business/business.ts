import { MONTHS, getCurrentMonth , getMonthByIndex, getMonthIndex, isMonthValid } from '@repo/services/date/month/month';
import { DEFAULT_TABLES_PARAMS } from '@repo/services/spreadsheet/table/constants';
import type { TablesParams } from '@repo/services/spreadsheet/table/types';

import { EExpenseType } from '../../../api';

import type { ExpenseEntity, InitializedExpense } from '../types';
import type Expense from '../expense';

export default class ExpenseBusiness {
    initialize(expense: Expense, value: number, month?: ExpenseEntity['month']): InitializedExpense {
        return expense.type === EExpenseType.FIXED
            ? this.handleFixedExpense(expense, value)
            : this.handleVariableExpense(expense, value, month);
    }

    reinitialize(months: Array<string>, expense: Expense, existingExpense?: Expense): Expense {
        if(!existingExpense) {
            return expense;
        }
        months.forEach(month => {
            existingExpense[month] += expense[month];
            existingExpense[`${month}_paid`] = expense[`${month}_paid`];
        });

        existingExpense.type = expense.type;
        existingExpense.instalment_number = expense.instalment_number;

        return  existingExpense;
    }

    private handleFixedExpense(expense: Expense, value: number): InitializedExpense {
        const expenseForCurrentYear = this.updateMonthsOfExpense(expense, MONTHS, value, expense.paid);
        return {
            nextYear: expense.year + 1,
            requiresNewBill: false,
            expenseForNextYear: undefined,
            expenseForCurrentYear,
        };
    }

    private handleVariableExpense(expense: Expense, value: number, month?: ExpenseEntity['month']): InitializedExpense {
        const startMonth = month ?? getCurrentMonth();
        isMonthValid(startMonth);
        const startMonthIndex = getMonthIndex(startMonth?.toUpperCase() as ExpenseEntity['month']);
        const { monthsForCurrentYear, monthsForNextYear } = this.splitMonthsByYear(expense.year, expense.instalment_number, startMonthIndex);
        const expenseForCurrentYear = this.updateMonthsOfExpense(expense, monthsForCurrentYear, value, expense.paid);

        const result: InitializedExpense = {
            nextYear: expense.year + 1,
            requiresNewBill: monthsForNextYear.length > 0,
            monthsForNextYear,
            monthsForCurrentYear,
            expenseForCurrentYear,
            expenseForNextYear: undefined,
        };

        if (result.requiresNewBill) {
            result.expenseForNextYear = this.handleExpenseForNextYear(expense, result.nextYear, value, monthsForNextYear);
        }
        return result;
    }

    private updateMonthsOfExpense(expense: Expense, months: Array<string>, value: number, paid: boolean): Expense {
        const updatedExpense = { ...expense };
        months.forEach((month) => {
            updatedExpense[month] += value;
            updatedExpense[`${month}_paid`] = paid;
        });
        MONTHS.forEach((month) => {
            if(updatedExpense[month] === 0) {
                updatedExpense[`${month}_paid`] = true;
            }
        });
        updatedExpense.instalment_number = expense.type === EExpenseType.FIXED ? 12 : months.length;
        return updatedExpense;
    }

    private splitMonthsByYear(currentYear: number, instalments: number, startMonthIndex: number) {
        const monthsForCurrentYear: Array<string> = [];
        const monthsForNextYear: Array<string> = [];

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

    private handleExpenseForNextYear(expense: Expense, year: number, value: number, months: Array<string>): Expense {
        const builtExpense: Expense = {
            ...expense,
            id: '',
            year,
            instalment_number: months.length,
        };

        months.forEach(month => {
            builtExpense[month] = value;
            builtExpense[`${month}_paid`] = builtExpense.paid;
        });
        return builtExpense;
    }
    
    calculate(expense: Expense): Expense {
        const builtExpense = { ...expense };
        if(builtExpense.paid) {
            MONTHS.forEach((month) => {
                builtExpense[`${month}_paid`] = true;
            });
        }
        return this.calculateTotals(builtExpense);
    }

    private calculateTotals(expense: Expense): Expense {
        const calculationOfTotals = this.calculateTotalAndPaid(expense);
        expense.total = Number(calculationOfTotals.total.toFixed(2));
        expense.total_paid = Number(calculationOfTotals.total_paid.toFixed(2));
        expense.paid = MONTHS.every((month) => expense[`${month}_paid`] === true);
        return expense;
    }

    private calculateTotalAndPaid(expense: Expense) {
        const result = {
            total: 0,
            total_paid: 0,
        };
        MONTHS.forEach(month => {
            result.total += expense[month];
            result.total_paid += expense[`${month}_paid`] ? expense[month] : 0;
        });

        return result;
    }

    public buildTablesParams(expenses: Array<Expense> = [], tableWidth: number): TablesParams {
        const tables: TablesParams['tables'] = [];

        expenses.forEach((expense) => {
            const monthlyData = MONTHS.map((month) => ({
                month: month.toUpperCase(),
                value: expense[month],
                paid: expense[`${month}_paid`],
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
            headers: ['month', 'value', 'paid'],
            tableWidth,
            tableDataRows: MONTHS.length,
        };
    }

    public totalByMonth(month: string, expenses: Array<Expense> = []): number {
        return expenses.reduce((sum, expense) => sum + (Number(expense?.[month]) || 0), 0);
    }

    public isAllPaid(expense: Expense): boolean {
        for (const month of MONTHS) {
            if (!expense || !Object.prototype.hasOwnProperty.call(expense, `${month}_paid`) || !expense[`${month}_paid`]) {
                return true;
            }
        }
        return false;
    }

    public totalPaidByMonth(expenses: Array<Expense> = []): boolean {
        if (expenses.length === 0) {
            return false;
        }
        for (const month of MONTHS) {
            for (const expense of expenses) {
                if (!expense || !Object.prototype.hasOwnProperty.call(expense, `${month}_paid`) || !expense[`${month}_paid`]) {
                    return true;
                }
            }
        }
        return false;
    }
}