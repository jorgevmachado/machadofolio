import { getCurrentMonth, getMonthByIndex, getMonthIndex, isMonthValid, MONTHS, TMonth } from '@repo/services';

import { Month, MonthBusiness, MonthsCalculated } from '../../month';

import { ExpenseEntity, ExpenseWithMonthsAndPaid, InitializedExpense } from '../types';
import type Expense from '../expense';

import { SpreadsheetBusiness } from './spreadsheet';


export default class ExpenseBusiness {
    private readonly spreadsheetBusiness: SpreadsheetBusiness
    private readonly monthsBusiness: MonthBusiness;

    constructor() {
        this.spreadsheetBusiness = new SpreadsheetBusiness();
        this.monthsBusiness = new MonthBusiness();
    }

    public get spreadsheet(): SpreadsheetBusiness {
        return this.spreadsheetBusiness;
    }

    public initialize(expense: Expense, month?: ExpenseEntity['month']): InitializedExpense {
        return expense.type === 'FIXED'
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
            if (existingCurrentMonth && currentMonth) {
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
            expenseForCurrentYear: { ...expense, instalment_number: monthsForCurrentYear.length },
        };

        if (result.requiresNewBill) {
            result.expenseForNextYear = {
                ...expense,
                id: '',
                year: result.nextYear,
                instalment_number: monthsForNextYear.length
            };
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

    private calculateChildren(expenses: Array<Expense>, month: Month): Month {
        return expenses.reduce((acc, expense) => this.monthsBusiness.calculateByMonth(acc, expense?.months), month);
    }

    private calculateParent(expense: Expense): Expense {
        if (!expense?.children || expense.children.length === 0) {
            return expense;
        }
        const builtExpense = { ...expense };
        builtExpense.children = expense.children.map((child) => this.calculate({ ...child, children: undefined }));
        builtExpense.months = expense.months.map((month) => this.calculateChildren(builtExpense.children, month));
        return builtExpense;
    }

    public calculate(expense: Expense): Expense {
        const expenseToCalculate = expense.children?.length > 0 ? this.calculateParent(expense) : expense;
        const monthsCalculated = this.monthsBusiness.calculateAll(expenseToCalculate?.months);
        expenseToCalculate.paid = (!expenseToCalculate?.months || expenseToCalculate?.months?.length === 0) ? expense.paid : monthsCalculated.allPaid;
        expenseToCalculate.total = monthsCalculated.total;
        expenseToCalculate.total_paid = monthsCalculated.totalPaid;
        expenseToCalculate.total_pending = monthsCalculated.totalPending;
        return expenseToCalculate;
    }

    public totalByMonth(month: string, expenses: Array<Expense> = []): number {
        return expenses.reduce((sum, expense) => {
            return sum + this.monthsBusiness.totalByMonth(month, expense?.months);
        }, 0);
    }

    public allHaveBeenPaid(expenses: Array<Expense> = []): boolean {
        if (expenses.length === 0) {
            return false;
        }
        return expenses.every(expense => expense && expense.paid === true);
    }

    public calculateAll(expenses: Array<Expense> = []): MonthsCalculated {
        return expenses.reduce((acc, expense) => {
            const expenseCalculated = this.calculate(expense);
            acc.total = acc.total + expenseCalculated.total;
            acc.allPaid = acc.allPaid && expenseCalculated.paid;
            acc.totalPaid = acc.totalPaid + expenseCalculated.total_paid;
            acc.totalPending = acc.totalPending + expenseCalculated.total_pending;
            return acc;
        }, {
            total: 0,
            allPaid: true,
            totalPaid: 0,
            totalPending: 0,
        } as MonthsCalculated);
    }

    public convertMonthsToObject(expense: Expense): ExpenseWithMonthsAndPaid {
        const objectMonths = this.monthsBusiness.convertMonthsToObject(expense.months)

        const result: ExpenseWithMonthsAndPaid = {
            ...objectMonths,
            ...expense,
            parent: undefined,
            children: undefined,
        }

        if (expense.parent) {
            result.parent = this.convertMonthsToObject(expense.parent);
        }

        if (expense.children && expense.children.length) {
            result.children = expense.children.map((child) => this.convertMonthsToObject(child));
        }

        return result;

    }

    public monthsMapper(expenses: Array<Expense>): Array<Month> {
        const expenseMonths: Array<Month> = [];

        if(expenses.length === 0) {
            return expenseMonths;
        }

        expenses.forEach((expense) => {
            const months = expense?.months ?? [];
            if(months.length > 0) {
                expenseMonths.push(...months);
            }
            const expenseChildren = expense?.children ?? [];
            if(expenseChildren.length > 0) {
                expenseChildren.forEach((child) => {
                    const childMonths = child?.months ?? [];
                    if(childMonths.length > 0) {
                        expenseMonths.push(...childMonths);
                    }
                });
            }
        });


        return expenseMonths;
    }
}