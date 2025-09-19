import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

const mockGetCurrentMonthNumber = jest.fn();
jest.mock('@repo/services', () => ({
    getCurrentMonthNumber: mockGetCurrentMonthNumber
}))

import { EXPENSE_MONTH_MOCK } from '../mock';

import { ExpenseMonthEntity } from './types';
import ExpenseMonth from './expense-month';

describe('ExpenseMonth', () => {
    const mockEntity = EXPENSE_MONTH_MOCK as unknown as ExpenseMonthEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            mockGetCurrentMonthNumber.mockReturnValue(1);
            const result = new ExpenseMonth(mockEntity);
            expect(result).toBeInstanceOf(ExpenseMonth);
            expect(result.id).toBe(mockEntity.id);
            expect(result.year).toBe(mockEntity.year);
            expect(result.paid).toBe(mockEntity.paid);
            expect(result.value).toBe(mockEntity.value);
            expect(result.month).toBe(mockEntity.month);
            expect(result.expense).toBe(mockEntity.expense);
            expect(result.created_at).toBe(mockEntity.created_at);
            expect(result.updated_at).toBe(mockEntity.updated_at);
            expect(result.deleted_at).toBe(mockEntity.deleted_at);
        });

        it('should create an instance with only required parameters', () => {
            const result = new ExpenseMonth({
                value: 100,
                expense: mockEntity.expense
            });
            expect(result).toBeInstanceOf(ExpenseMonth);
            expect(result.id).toBeUndefined();
            expect(result.year).toEqual(2025);
            expect(result.paid).toBeFalsy();
            expect(result.value).toEqual(100);
            expect(result.month).toEqual(1);
            expect(result.expense).toBe(mockEntity.expense);
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
        });

        it('should throw an error when month is invalid', () => {
            mockGetCurrentMonthNumber.mockImplementationOnce(() => {
                throw new Error('The month provided is invalid: 13');
            });
            expect(() => new ExpenseMonth({
                value: 100,
                expense: mockEntity.expense,
                month: 13
            })).toThrow('The month provided is invalid: 13');
        });
    })
})