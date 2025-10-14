import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { EXPENSE_MOCK } from '../mock';

import Expense from './expense';
import type { ExpenseEntity } from './types';

describe('Expense', () => {
    const mockEntity: ExpenseEntity = EXPENSE_MOCK as unknown as ExpenseEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        it('should create an instance when receiving only mandatory parameters', () => {
            const expense = new Expense({
                bill: mockEntity.bill,
                type: mockEntity.type,
                supplier: mockEntity.supplier,
            });
            expect(expense).toBeInstanceOf(Expense);
            expect(expense.id).toBeUndefined();
            expect(expense.year).toBe(new Date().getFullYear());
            expect(expense.type).toBe(mockEntity.type);
            expect(expense.paid).toBeFalsy();
            expect(expense.total).toBe(0);
            expect(expense.months).toHaveLength(0);
            expect(expense.supplier).toBe(mockEntity.supplier);
            expect(expense.total_paid).toBe(0);
            expect(expense.created_at).toBeUndefined();
            expect(expense.updated_at).toBeUndefined();
            expect(expense.deleted_at).toBeUndefined();
            expect(expense.description).toBeUndefined();
            expect(expense.instalment_number).toBe(1,);
        });

        it('should create an instance with all provided parameters', () => {
            const expense = new Expense(mockEntity);
            expect(expense).toBeInstanceOf(Expense);
            expect(expense.id).toBe(mockEntity.id);
            expect(expense.year).toBe(mockEntity.year);
            expect(expense.type).toBe(mockEntity.type);
            expect(expense.paid).toBe(mockEntity.paid);
            expect(expense.total).toBe(mockEntity.total);
            expect(expense.months).toBe(mockEntity.months);
            expect(expense.supplier).toBe(mockEntity.supplier);
            expect(expense.total_paid).toBe(mockEntity.total_paid);
            expect(expense.created_at).toBe(mockEntity.created_at);
            expect(expense.updated_at).toBe(mockEntity.updated_at);
            expect(expense.deleted_at).toBe(mockEntity.deleted_at);
            expect(expense.description).toBe(mockEntity.description);
            expect(expense.instalment_number).toBe(mockEntity.instalment_number);
        });

        it('should create an instance with is_aggregate true', () => {
            const expenseSubAggregateMock = {
                ...mockEntity,
                is_aggregate: true,
                parent: mockEntity,
                children: [mockEntity],
                aggregate_name: 'aggregate',
            };
            const expense = new Expense(expenseSubAggregateMock);
            expect(expense.name).toEqual(`${expense.bill.name} aggregate ${expense.supplier.name}`);
            expect(expense.parent).toEqual(mockEntity);
            expect(expense.children).toHaveLength(1);
            expect(expense.is_aggregate).toBeTruthy();

        });

        it('should create an instance with is_aggregate true and no name', () => {
            const expenseSubAggregateMock = {
                ...mockEntity,
                is_aggregate: true,
                parent: mockEntity,
                children: [mockEntity],
                aggregate_name: undefined,
            };
            const expense = new Expense(expenseSubAggregateMock);
            expect(expense.name).toEqual(`${expense.bill.name}  ${expense.supplier.name}`);
            expect(expense.parent).toEqual(mockEntity);
            expect(expense.children).toHaveLength(1);
            expect(expense.is_aggregate).toBeTruthy();
        });
    });
});