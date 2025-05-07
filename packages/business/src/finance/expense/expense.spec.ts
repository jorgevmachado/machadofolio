import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

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

        it('should initialize fields with default values when no parameters are provided', () => {
            const expense = new Expense();

            expect(expense.year).toBe(new Date().getFullYear());
            expect(expense.paid).toBe(false);
            expect(expense.total).toBe(0);
            expect(expense.total_paid).toBe(0);
            expect(expense.instalment_number).toBe(1);
        });

        it('should keep optional fields undefined when they are not provided', () => {
            const params = {
                bill: expenseMock.bill,
                type: expenseMock.type,
                supplier: expenseMock.supplier,
                name: expenseMock.name,
            };

            const expense = new Expense(params);

            expect(expense.created_at).toBeUndefined();
            expect(expense.updated_at).toBeUndefined();
            expect(expense.deleted_at).toBeUndefined();
            expect(expense.description).toBeUndefined();
        });

        it('should override default values when provided in parameters', () => {
            const params = {
                ...expenseMock,
                active: false,
                paid: true,
            };

            const expense = new Expense(params);
            expect(expense.paid).toBe(true);
        });
    });
});