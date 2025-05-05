import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { INVALID_TYPE, REQUIRED_FIELD } from '../../shared';

import {
    getCurrentMonth,
    getMonthByIndex,
    getMonthIndex,
    isMonthValid,
    monthValidator,
    parseMonth
} from './month';
import { EMonth } from './enum';




describe('Date Month function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Month function', () => {
        describe('getCurrentMonth', () => {
            it('Should return the current month in string format and uppercase (EMonth).', () => {
                jest
                    .spyOn(global.Date, 'now')
                    .mockImplementationOnce(() => new Date(2023, 5, 1).getTime());

                const result = getCurrentMonth();
                expect(result).toEqual(EMonth.MAY);
                jest.restoreAllMocks();
            });
        });

        describe('getMonthIndex', () => {
            it('Should return the correct index for a valid month.', () => {
                expect(getMonthIndex(EMonth.JANUARY)).toBe(0);
                expect(getMonthIndex(EMonth.DECEMBER)).toBe(11);
            });
        });

        describe('getMonthByIndex', () => {
            it('Should return the correct month for a valid index.', () => {
                expect(getMonthByIndex(0)).toBe('january');
                expect(getMonthByIndex(11)).toBe('december');
            });

            it('Should return undefined for indexes outside the valid range.', () => {
                expect(getMonthByIndex(-1)).toBeUndefined();
                expect(getMonthByIndex(12)).toBeUndefined();
            });
        });

        describe('isMonthValid', () => {
            it('Should not throw error for valid months.', () => {
                expect(() => isMonthValid(EMonth.JANUARY)).not.toThrow();
                expect(() => isMonthValid(EMonth.DECEMBER)).not.toThrow();
            });
            it('Should throw an error for invalid months.', () => {
                expect(() => isMonthValid('INVALID')).toThrow(
                    'The month provided is invalid: INVALID',
                );
            });
        });

        describe('monthValidator', () => {
            it('must return valid for months equal 0.', () => {
                expect(monthValidator({ value: 0 })).toEqual({
                    valid: true,
                    value: 0,
                    message: 'Valid month.',
                });
            });

            it('must return valid for months equal 12.', () => {
                expect(monthValidator({ value: 12 })).toEqual({
                    valid: true,
                    value: 12,
                    message: 'Valid month.',
                });
            });

            it('must return valid for months equal 6.', () => {
                expect(monthValidator({ value: 6 })).toEqual({
                    valid: true,
                    value: 6,
                    message: 'Valid month.',
                });
            });

            it('should return invalid for months equal -1.', () => {
                expect(monthValidator({ value: -1 })).toEqual({
                    valid: false,
                    value: undefined,
                    message: 'Please enter a valid month.',
                });
            });

            it('should return invalid for months equal 13.', () => {
                expect(monthValidator({ value: 13 })).toEqual({
                    valid: false,
                    value: undefined,
                    message: 'Please enter a valid month.',
                });
            });

            it('should return a type error for non-numeric inputs.', () => {
                expect(monthValidator({ value: 'January' })).toEqual(INVALID_TYPE);
                expect(monthValidator({ value: true })).toEqual(INVALID_TYPE);
            });

            it('should return a required field error for missing entries.', () => {
                expect(monthValidator({ value: undefined })).toEqual(REQUIRED_FIELD);
            });
        });

        describe('parseMonth', () => {
            it('should return the adjusted month (0-11) for valid entries (1-12).', () => {
                expect(parseMonth('1')).toBe(0);
                expect(parseMonth('12')).toBe(11);
            });

            it('should return 0 if month is 0.', () => {
                expect(parseMonth('0')).toBe(0);
            });

            it('should return undefined for months outside the allowed range.', () => {
                expect(parseMonth('13')).toBeUndefined();
                expect(parseMonth('-1')).toBeUndefined();
            });

            it('should return undefined for invalid inputs.', () => {
                expect(parseMonth('abc')).toBeUndefined();
                expect(parseMonth(undefined)).toBeUndefined();
                expect(parseMonth('')).toBeUndefined();
            });
        });
    });
});