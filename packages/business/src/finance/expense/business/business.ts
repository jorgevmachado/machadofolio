import { splitMonthsByInstalment } from '@repo/services';

import { type Month, MonthBusiness, type MonthsCalculated } from '../../month';

import type Expense from '../expense';
import type { ExpenseWithMonthsAndPaid } from '../types';

import { SpreadsheetBusiness } from './spreadsheet';
import type { PrepareForCreationParams, PrepareForCreationResult } from './types';


export default class ExpenseBusiness {
    private readonly spreadsheetBusiness: SpreadsheetBusiness;
    private readonly monthsBusiness: MonthBusiness;

    constructor() {
        this.spreadsheetBusiness = new SpreadsheetBusiness();
        this.monthsBusiness = new MonthBusiness();
    }

    public get spreadsheet(): SpreadsheetBusiness {
        return this.spreadsheetBusiness;
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

    public monthsMapper(expenses: Array<Expense>): Array<Month> {
        const expenseMonths: Array<Month> = [];

        if (expenses.length === 0) {
            return expenseMonths;
        }

        expenses.forEach((expense) => {
            const months = expense?.months ?? [];
            if (months.length > 0) {
                expenseMonths.push(...months);
            }
            const expenseChildren = expense?.children ?? [];
            if (expenseChildren.length > 0) {
                expenseChildren.forEach((child) => {
                    const childMonths = child?.months ?? [];
                    if (childMonths.length > 0) {
                        expenseMonths.push(...childMonths);
                    }
                });
            }
        });

        return expenseMonths;
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

    public prepareForCreation({
                                  value = 0,
                                  month,
                                  months,
                                  expense
                              }: PrepareForCreationParams): PrepareForCreationResult {
        const result: PrepareForCreationResult = {
            nextYear: expense.year + 1,
            requiresNewBill: false,
            monthsForNextYear: [],
            expenseForNextYear: undefined,
            monthsForCurrentYear: [],
            expenseForCurrentYear: expense,
            instalmentForNextYear: 0
        };

        const paramsForCurrentYear = {
            year: expense.year,
            paid: expense.paid,
            value,
            received_at: expense.created_at
        };

        if (months && months?.length > 0) {
            result.monthsForCurrentYear = months.length === 12
                ? months
                : this.monthsBusiness.generateMonthListCreationParameters({
                    ...paramsForCurrentYear,
                    months,
                });
            return result;
        }

        if (expense.type === 'FIXED') {
            result.expenseForCurrentYear = { ...expense, instalment_number: 12 };
            result.monthsForCurrentYear = this.monthsBusiness.generateMonthListCreationParameters({
                ...paramsForCurrentYear,
                month,
            });
            return result;
        }

        const {
            monthsForNextYear,
            monthsForCurrentYear
        } = splitMonthsByInstalment(expense.year, expense.instalment_number, month);

        if (monthsForNextYear.length > 0) {
            result.requiresNewBill = true;
            result.expenseForNextYear = {
                ...expense,
                id: '',
                year: result.nextYear,
                instalment_number: monthsForNextYear.length
            };
            result.instalmentForNextYear = monthsForNextYear.length;
            const paramsForNextYear = {
                year: result.nextYear,
                paid: expense.paid,
                value,
                received_at: expense.created_at
            };
            const monthsForNextYearParams = monthsForNextYear.map((month) =>
                this.monthsBusiness.generatePersistMonthParams({
                    ...paramsForNextYear,
                    month,
                }));

            result.monthsForNextYear = this.monthsBusiness.generateMonthListCreationParameters({
                ...paramsForNextYear,
                months: monthsForNextYearParams,
            });
        }

        if (monthsForCurrentYear.length > 0) {
            const monthsForCurrentYearParams = monthsForCurrentYear.map((month) =>
                this.monthsBusiness.generatePersistMonthParams({
                    ...paramsForCurrentYear,
                    month,
                }));

            result.monthsForCurrentYear = this.monthsBusiness.generateMonthListCreationParameters({
                ...paramsForCurrentYear,
                months: monthsForCurrentYearParams,
            });
        }


        return result;
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

    public convertMonthsToObject(expense: Expense): ExpenseWithMonthsAndPaid {
        const objectMonths = this.monthsBusiness.convertMonthsToObject(expense.months);

        const result: ExpenseWithMonthsAndPaid = {
            ...objectMonths,
            ...expense,
            parent: undefined,
            children: undefined,
        };

        if (expense.parent) {
            result.parent = this.convertMonthsToObject(expense.parent);
        }

        if (expense.children && expense.children.length) {
            result.children = expense.children.map((child) => this.convertMonthsToObject(child));
        }

        return result;

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

    private calculateChildren(expenses: Array<Expense>, month: Month): Month {
        return expenses.reduce((acc, expense) => this.monthsBusiness.calculateByMonth(acc, expense?.months), month);
    }
}