import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { MONTHS } from '@repo/services/date/month/month';

import { EXPENSE_MOCK } from './mock';
import Expense from './expense';
import type { ExpenseEntity } from './types';

describe('Expense', () => {
    const expenseMock: ExpenseEntity = EXPENSE_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        it('should create an instance with all provided parameters', () => {
            const expense = new Expense(expenseMock);
            expect(expense).toBeInstanceOf(Expense);
            expect(expense.id).toBe(expenseMock.id);
            expect(expense.year).toBe(expenseMock.year);
            expect(expense.type).toBe(expenseMock.type);
            expect(expense.paid).toBe(expenseMock.paid);
            expect(expense.total).toBe(expenseMock.total);
            expect(expense.supplier).toBe(expenseMock.supplier);
            expect(expense.total_paid).toBe(expenseMock.total_paid);
            expect(expense.description).toBe(expenseMock.description);
            expect(expense.instalment_number).toBe(
                expenseMock.instalment_number,
            );
            expect(expense.created_at).toBe(expenseMock.created_at);
            expect(expense.updated_at).toBe(expenseMock.updated_at);
            expect(expense.deleted_at).toBe(expenseMock.deleted_at);
        });

        it('should keep optional fields undefined when they are not provided', () => {
            const params = {
                bill: expenseMock.bill,
                type: expenseMock.type,
                supplier: expenseMock.supplier,
            };

            const expense = new Expense(params);

            expect(expense.created_at).toBeUndefined();
            expect(expense.updated_at).toBeUndefined();
            expect(expense.deleted_at).toBeUndefined();
            expect(expense.description).toBeUndefined();
        });

        it('should override default values when provided in parameters', () => {
            const expenseToUpdate: Expense = {
                ...expenseMock,
                year: 2030,
                paid: undefined,
                bill: {
                    ...expenseMock.bill,
                    name: 'New Bill'
                },
                name: 'New Bill New Supplier',
                total: 12,
                supplier: {
                    ...expenseMock.supplier,
                    name: 'New Supplier'
                },
                name_code: 'new_bill_new_supplier',
                total_paid: 12,
                description: 'New Description',
                instalment_number: 12,
            };

            MONTHS.forEach((month) => {
                expenseToUpdate[month] = 1;
                expenseToUpdate[`${month}_paid`] = true;
            });

            const expense = new Expense({
                ...expenseMock,
                ...expenseToUpdate,
            });
            expect(expense.year).toBe(expenseToUpdate.year);
            expect(expense.paid).toBeFalsy();
            expect(expense.bill.name).toBe(expenseToUpdate.bill.name);
            expect(expense.name).toBe(expenseToUpdate.name);
            expect(expense.total).toBe(expenseToUpdate.total);
            expect(expense.supplier.name).toBe(expenseToUpdate.supplier.name);
            expect(expense.name_code).toBe(expenseToUpdate.name_code);
            expect(expense.total_paid).toBe(expenseToUpdate.total_paid);
            expect(expense.description).toBe(expenseToUpdate.description);
            expect(expense.instalment_number).toBe(expenseToUpdate.instalment_number);
            MONTHS.forEach((month) => {
                expect(expense[month]).toBe(1);
                expect(expense[`${month}_paid`]).toBeTruthy();
            });

        });

        it('should create an instance with is_aggregate true', () => {
            const expenseSubAggregateMock = {
                ...expenseMock,
                is_aggregate: true,
                parent: expenseMock,
                children: [expenseMock],
                aggregate_name: 'aggregate',
            };
            const expense = new Expense(expenseSubAggregateMock);
            expect(expense.is_aggregate).toBeTruthy();
            expect(expense.parent).toEqual(expenseMock);
            expect(expense.children).toHaveLength(1);
            expect(expense.name).toEqual(`${expense.bill.name} ${expense.supplier.name} aggregate`);
        });

        it('should create an instance with is_aggregate true and no name', () => {
            const expenseSubAggregateMock = {
                ...expenseMock,
                is_aggregate: true,
                parent: expenseMock,
                children: [expenseMock],
                aggregate_name: undefined,
            };
            const expense = new Expense(expenseSubAggregateMock);
            expect(expense.is_aggregate).toBeTruthy();
            expect(expense.parent).toEqual(expenseMock);
            expect(expense.children).toHaveLength(1);
            expect(expense.name).toEqual(`${expense.bill.name} ${expense.supplier.name} `);
        });
    });
});