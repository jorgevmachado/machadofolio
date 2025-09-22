import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

const mockGetMonthByIndex = jest.fn();
const mockGetCurrentMonthNumber = jest.fn();
jest.mock('@repo/services', () => ({
    getMonthByIndex: mockGetMonthByIndex,
    getCurrentMonthNumber: mockGetCurrentMonthNumber
}))

import { EXPENSE_MONTH_MOCK, INCOME_MONTH_MOCK } from '../mock';

import type { MonthEntity } from './types';
import Month from './month';

describe('Month', () => {
    const mockExpenseMonthEntity = EXPENSE_MONTH_MOCK as unknown as MonthEntity;
    const mockIncomeMonthEntity = INCOME_MONTH_MOCK as unknown as MonthEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        it('should create an instance with default values when no parameters are provided', () => {
            const result = new Month();
            expect(result).toBeInstanceOf(Month);
            expect(result.id).toBeUndefined();
            expect(result.year).toEqual(2025);
            expect(result.code).toEqual(1);
            expect(result.paid).toBeFalsy();
            expect(result.value).toEqual(0);
            expect(result.label).toEqual('january');
            expect(result.income).toBeUndefined();
            expect(result.expense).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.received_at).toBeUndefined();
        });

        it('should create an instance when receiving only mandatory parameters', () => {
            const result = new Month({ value: 100 });
            expect(result).toBeInstanceOf(Month);
            expect(result.id).toBeUndefined();
            expect(result.year).toEqual(2025);
            expect(result.code).toEqual(1);
            expect(result.paid).toBeFalsy();
            expect(result.value).toEqual(100);
            expect(result.label).toEqual('january');
            expect(result.income).toBeUndefined();
            expect(result.expense).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.received_at).toBeUndefined();
        });

        it('should create an instance when receiving expense in parameters', () => {
            mockGetCurrentMonthNumber.mockReturnValue(1);
            const result = new Month(mockExpenseMonthEntity);
            expect(result).toBeInstanceOf(Month);
            expect(result.id).toBe(mockExpenseMonthEntity.id);
            expect(result.year).toBe(mockExpenseMonthEntity.year);
            expect(result.code).toBe(mockExpenseMonthEntity.code);
            expect(result.paid).toBe(mockExpenseMonthEntity.paid);
            expect(result.value).toBe(mockExpenseMonthEntity.value);
            expect(result.label).toBe(mockExpenseMonthEntity.label);
            expect(result.income).toBe(mockExpenseMonthEntity.income);
            expect(result.expense).toBe(mockExpenseMonthEntity.expense);
            expect(result.created_at).toBe(mockExpenseMonthEntity.created_at);
            expect(result.updated_at).toBe(mockExpenseMonthEntity.updated_at);
            expect(result.deleted_at).toBe(mockExpenseMonthEntity.deleted_at);
            expect(result.received_at).toBe(mockExpenseMonthEntity.deleted_at);
        });

        it('should create an instance when receiving income in parameters', () => {
            mockGetCurrentMonthNumber.mockReturnValue(1);
            const result = new Month(mockIncomeMonthEntity);
            expect(result).toBeInstanceOf(Month);
            expect(result.id).toBe(mockIncomeMonthEntity.id);
            expect(result.year).toBe(mockIncomeMonthEntity.year);
            expect(result.code).toBe(mockIncomeMonthEntity.code);
            expect(result.paid).toBe(mockIncomeMonthEntity.paid);
            expect(result.value).toBe(mockIncomeMonthEntity.value);
            expect(result.label).toBe(mockIncomeMonthEntity.label);
            expect(result.income).toBe(mockIncomeMonthEntity.income);
            expect(result.expense).toBe(mockIncomeMonthEntity.expense);
            expect(result.created_at).toBe(mockIncomeMonthEntity.created_at);
            expect(result.updated_at).toBe(mockIncomeMonthEntity.updated_at);
            expect(result.deleted_at).toBe(mockIncomeMonthEntity.deleted_at);
            expect(result.received_at).toBe(mockIncomeMonthEntity.deleted_at);
        });
    });
})