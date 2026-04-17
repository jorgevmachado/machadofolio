import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { INVALID_TYPE, REQUIRED_FIELD } from '../../shared';

import {
    convertTypeToEnum,
    getCurrentMonth,
    getCurrentMonthNumber,
    getMonthByIndex,
    getMonthIndex,
    getMonthNumber,
    isMonthValid,
    monthValidator,
    parseMonth,
    splitMonthsByInstalment,
    totalByMonth
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
                const mockDate = new Date(2023, 6, 1);
                jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

                const result = getCurrentMonth();
                expect(result).toEqual(EMonth.JULY);
                jest.restoreAllMocks();
            });

            it('Should return the first month in string format and uppercase (EMonth) when error in new Date.', () => {
                jest.spyOn(global.Date.prototype, 'getMonth').mockImplementation(() => {
                    throw new Error('Error to get current month.');
                });

                const result = getCurrentMonth();
                expect(result).toEqual(EMonth.JANUARY);
                jest.restoreAllMocks();
            });
        });

        describe('getMonthIndex', () => {
            it('Should return the correct index for a valid month.', () => {
                expect(getMonthIndex(EMonth.JANUARY)).toBe(0);
                expect(getMonthIndex(EMonth.DECEMBER)).toBe(11);
            });

            it('Should return the 0 index for a invalid month.', () => {
                expect(getMonthIndex()).toBe(0);
            });
        });

        describe('getMonthByIndex', () => {
            it('Should return the correct month for a valid index.', () => {
                expect(getMonthByIndex(0)).toBe('january');
                expect(getMonthByIndex(11)).toBe('december');
            });

            it('Should return undefined for indexes outside the valid range.', () => {
                expect(getMonthByIndex(-1)).toBe('january');
                expect(getMonthByIndex(12)).toBe('january');
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

        describe('totalByMonth', () => {
            it('returns 0 for empty array.', () => {
                expect(totalByMonth('january', [])).toBe(0);
            });

            it('adds only the month informed in CycleOfMonths.', () => {
                const arr = [
                    {
                        january: 10,
                        february: 2,
                        march: 3,
                        april: 0,
                        may: 1,
                        june: 0,
                        july: 0,
                        august: 0,
                        september: 0,
                        october: 1,
                        november: 0,
                        december: 3,
                    },
                    {
                        january: 5,
                        february: 1,
                        march: 1,
                        april: 1,
                        december: 8,
                    }
                ];
                expect(totalByMonth('january', arr)).toBe(15);
                expect(totalByMonth('december', arr)).toBe(11);
                expect(totalByMonth('february', arr)).toBe(3);
            });

            it('works with multiple objects and extra fields.', () => {
                const arr = [
                    { january: 2, february: 3, xpto: 999 },
                    { january: 1, february: 0, xyz: 'abc' },
                    { march: 9, date: new Date() }
                ];
                expect(totalByMonth('january', arr)).toBe(3);
                expect(totalByMonth('february', arr)).toBe(3);
                expect(totalByMonth('march', arr)).toBe(9);
            });

            it('ignore fields not related to month.', () => {
                const arr = [{ name: 'Maria', valor: 10 }, { outro: true }];
                expect(totalByMonth('january', arr)).toBe(0);
            });

            it('returns 0 when there is no month field in any object.', () => {
                const arr = [{ foo: 1, bar: 2 }];
                expect(totalByMonth('november', arr)).toBe(0);
            });

            it('ignores non-numeric values in month.', () => {
                const arr = [
                    {
                        january: 'a',
                        february: null,
                        march: undefined,
                        april: 7,
                        may: NaN,
                        june: 3
                    },
                    {
                        january: 5
                    }
                ];
                expect(totalByMonth('january', arr)).toBe(5);
                expect(totalByMonth('april', arr)).toBe(7);
                expect(totalByMonth('june', arr)).toBe(3);
                expect(totalByMonth('may', arr)).toBe(0);
            });

            it('works with partially filled objects.', () => {
                const arr = [
                    { january: 1 },
                    { february: 2 },
                    { march: 3 },
                    {},
                    { december: 10 }
                ];
                expect(totalByMonth('january', arr)).toBe(1);
                expect(totalByMonth('february', arr)).toBe(2);
                expect(totalByMonth('march', arr)).toBe(3);
                expect(totalByMonth('december', arr)).toBe(10);
                expect(totalByMonth('july', arr)).toBe(0);
            });
        });

        describe('getMonthNumber', () => {
            it('should return the correct month number for a valid month.', () => {
                expect(getMonthNumber(EMonth.JANUARY)).toBe(1);
                expect(getMonthNumber(EMonth.FEBRUARY)).toBe(2);
                expect(getMonthNumber(EMonth.MARCH)).toBe(3);
                expect(getMonthNumber(EMonth.APRIL)).toBe(4);
                expect(getMonthNumber(EMonth.MAY)).toBe(5);
                expect(getMonthNumber(EMonth.JUNE)).toBe(6);
                expect(getMonthNumber(EMonth.JULY)).toBe(7);
                expect(getMonthNumber(EMonth.AUGUST)).toBe(8);
                expect(getMonthNumber(EMonth.SEPTEMBER)).toBe(9);
                expect(getMonthNumber(EMonth.OCTOBER)).toBe(10);
                expect(getMonthNumber(EMonth.NOVEMBER)).toBe(11);
                expect(getMonthNumber(EMonth.DECEMBER)).toBe(12);
            });

            it('should throw error when received invalid month.', () => {
                expect(() => getMonthNumber('INVALID')).toThrow(
                    'The month provided is invalid: INVALID',
                );
            })
        });

        describe('getCurrentMonthNumber', () => {
            it('should return the correct month number for a string valid month.', () => {
                expect(getCurrentMonthNumber(EMonth.JANUARY)).toBe(1);
                expect(getCurrentMonthNumber(EMonth.FEBRUARY)).toBe(2);
                expect(getCurrentMonthNumber(EMonth.MARCH)).toBe(3);
                expect(getCurrentMonthNumber(EMonth.APRIL)).toBe(4);
                expect(getCurrentMonthNumber(EMonth.MAY)).toBe(5);
                expect(getCurrentMonthNumber(EMonth.JUNE)).toBe(6);
                expect(getCurrentMonthNumber(EMonth.JULY)).toBe(7);
                expect(getCurrentMonthNumber(EMonth.AUGUST)).toBe(8);
                expect(getCurrentMonthNumber(EMonth.SEPTEMBER)).toBe(9);
                expect(getCurrentMonthNumber(EMonth.OCTOBER)).toBe(10);
                expect(getCurrentMonthNumber(EMonth.NOVEMBER)).toBe(11);
                expect(getCurrentMonthNumber(EMonth.DECEMBER)).toBe(12);
            });

            it('should return the correct month number for a number valid month.', () => {
                expect(getCurrentMonthNumber(1)).toBe(1);
                expect(getCurrentMonthNumber(2)).toBe(2);
                expect(getCurrentMonthNumber(3)).toBe(3);
                expect(getCurrentMonthNumber(4)).toBe(4);
                expect(getCurrentMonthNumber(5)).toBe(5);
                expect(getCurrentMonthNumber(6)).toBe(6);
                expect(getCurrentMonthNumber(7)).toBe(7);
                expect(getCurrentMonthNumber(8)).toBe(8);
                expect(getCurrentMonthNumber(9)).toBe(9);
                expect(getCurrentMonthNumber(10)).toBe(10);
                expect(getCurrentMonthNumber(11)).toBe(11);
                expect(getCurrentMonthNumber(12)).toBe(12);
            });

            it('should throw error when received a invalid string month.', () => {
                expect(() => getCurrentMonthNumber('INVALID')).toThrow(
                    'The month provided is invalid: INVALID',
                );
            })

            it('should throw error when received a invalid number month.', () => {
                expect(() => getCurrentMonthNumber(0)).toThrow(
                    'The month provided is invalid: 0',
                );
            })

            it('should throw error when received a undefined month.', () => {
                expect(() => getCurrentMonthNumber(undefined)).toThrow(
                    'The month is required',
                );
            })
        });

        describe('convertTypeToEnum', () => {
            it('should return the correct EMonth for a valid string month.', () => {
                expect(convertTypeToEnum('july')).toEqual(EMonth.JULY);
            });
            it('should return JANUARY when received a invalid string month.', () => {
                expect(convertTypeToEnum(undefined)).toEqual(EMonth.JANUARY);
            });
        });

        describe('splitMonthsByInstalment', () => {
            it('Should return only months for current year and empty months for next year', () => {
                const result = splitMonthsByInstalment(
                    2025,
                    2,
                    EMonth.JANUARY
                );
                expect(result.monthsForCurrentYear).toEqual([EMonth.JANUARY, EMonth.FEBRUARY]);
                expect(result.monthsForNextYear).toHaveLength(0);
            });

            it('should return months for current year and next year', () => {
                const result = splitMonthsByInstalment(
                    2025,
                    12,
                    EMonth.FEBRUARY
                );
                expect(result.monthsForCurrentYear).toHaveLength(11);
                expect(result.monthsForNextYear).toEqual([EMonth.JANUARY]);
            });

            it('should return months for current year without month', () => {
                const result = splitMonthsByInstalment(
                    2025,
                    1
                );
                expect(result.monthsForCurrentYear).toHaveLength(1);
                expect(result.monthsForNextYear).toHaveLength(0);
            });
        });
    });
});