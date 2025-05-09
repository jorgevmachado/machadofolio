import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { INVALID_TYPE, REQUIRED_FIELD } from '../shared';

import {
    calculateMaxDate,
    createDateFromYearMonthDay, dateOfBirthValidator, isDateString,
    isUnderMinimumAge, parseDateFromString,
    parseDateFromStringWithSeparator,
    parseStartDate
} from './date';


describe('Date function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('isUnderMinimumAge', () => {
        it('returns true if the date is less than 18', () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 17);
            expect(isUnderMinimumAge(date)).toBe(true);
        });
        it('returns false if the date is more than 18', () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 20);
            expect(isUnderMinimumAge(date)).toBe(false);
        });
    });

    describe('calculateMaxDate', () => {
        it('Must return the maximum date by a date', () => {
            const currentDate = new Date('2000-01-01');
            expect(calculateMaxDate(currentDate)).toEqual(currentDate);
        });

        it('Must return the maximum date by minAge', () => {
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() - 18);
            expect(calculateMaxDate(new Date('2000-01-01'), 18)).toEqual(currentDate);
        });

        it('Must return undefined when dont receive date or minAge', () => {
            expect(calculateMaxDate()).toBeUndefined();
        });
    });

    describe('createDateFromYearMonthDay', () => {
        it('It must return the conversion of year month and day to Date', () => {
            expect(
                createDateFromYearMonthDay({
                    day: 1,
                    year: 2000,
                    month: 0,
                }),
            ).toEqual(new Date(2000, 0, 1));
        });

        it('It must return the conversion of year month and day to Date with validation', () => {
            expect(
                createDateFromYearMonthDay({
                    day: 1,
                    year: 2000,
                    month: 0,
                    withValidation: true,
                }),
            ).toEqual(new Date(2000, 0, 1));
        });

        it('Converting year, month and day to Date must return undefined because the params is undefined', () => {
            expect(
                createDateFromYearMonthDay({
                    day: 1,
                    year: undefined,
                    month: 0,
                }),
            ).toBe(undefined);
        });

        it('Converting year, month and day to Date with fallback must date', () => {
            expect(
                createDateFromYearMonthDay({
                    day: undefined,
                    year: undefined,
                    month: undefined,
                    fallback: true,
                }),
            ).toEqual(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
        });

        it('Converting year, month and day to Date must return undefined because the month is undefined', () => {
            expect(
                createDateFromYearMonthDay({
                    day: 1,
                    year: 2000,
                    month: undefined,
                }),
            ).toBe(undefined);
        });

        it('Converting year, month and day to Date must return undefined because the day is undefined', () => {
            expect(
                createDateFromYearMonthDay({
                    day: undefined,
                    year: 2000,
                    month: 0,
                }),
            ).toBe(undefined);
        });
    });

    describe('parseDateFromString', () => {
        it('Must convert date string with international standard to date.', () => {
            expect(parseDateFromString('2000-01-01')).toEqual(new Date(2000, 0, 1));
        });

        it('Must convert date string iso with international standard to date.', () => {
            expect(parseDateFromString('2000-01-01T00:00:00Z')).toEqual(new Date(2000, 0, 1));
        });

        it('Must convert date string iso with timezone and international standard to date.', () => {
            expect(parseDateFromString('2000-01-01T00:00:00.000Z')).toEqual(new Date(2000, 0, 1));
        });

        it('Must convert the date string with Brazilian standard to date.', () => {
            expect(parseDateFromString('01/01/2000')).toEqual(new Date(2000, 0, 1));
        });

        it('It should return undefined because the month, year and day are out of range.', () => {
            expect(parseDateFromString('0-0-0')).toEqual(undefined);
        });

        it('Should return undefined because the separator pattern was not recognized.', () => {
            expect(parseDateFromString('20*02*200')).toBe(undefined);
        });

        it('It must return undefined because the values do not match the date.', () => {
            expect(parseDateFromString('yyyy-mm-dd')).toBe(undefined);
        });

        it('It must return undefined because the values is undefined.', () => {
            expect(parseDateFromString(undefined)).toBe(undefined);
        });
    });

    describe('parseStartDate', () => {
        it('Must convert a string to date', () => {
            expect(
                parseStartDate({
                    initialDate: {
                        day: 20,
                        year: 1990,
                        month: 8,
                    },
                    stringDate: '2000-01-01',
                }),
            ).toEqual(new Date(2000, 0, 1));
        });

        it('Must convert a parseDate to date', () => {
            expect(
                parseStartDate({
                    initialDate: {
                        day: 20,
                        year: 1990,
                        month: 8,
                    },
                }),
            ).toEqual(new Date(1990, 7, 20));
        });

        it('should return undefined when not received initialDate', () => {
            expect(
                parseStartDate({
                    initialDate: undefined,
                }),
            ).toBeUndefined();
        });
    });

    describe('parseDateFromStringWithSeparator', () => {
        it('Must convert date string with international standard to date.', () => {
            expect(parseDateFromStringWithSeparator('2000-01-01', '-')).toEqual(
                new Date(2000, 0, 1),
            );
        });

        it('Must convert the date string with Brazilian standard to date.', () => {
            expect(parseDateFromStringWithSeparator('01/01/2000', '/')).toEqual(
                new Date(2000, 0, 1),
            );
        });

        it('It should return undefined because the pattern was not recognized.', () => {
            expect(parseDateFromStringWithSeparator('20*02*200')).toBe(undefined);
        });
    });

    describe('dateOfBirthValidator', () => {
        it('should return invalid when received undefined dateOfBirth', () => {
            expect(dateOfBirthValidator({})).toEqual(REQUIRED_FIELD);
        });

        it('should return invalid when received dateOfBirth type', () => {
            expect(dateOfBirthValidator({ value: 100 })).toEqual(INVALID_TYPE);
        });

        it('should return invalid when received invalid date string', () => {
            expect(dateOfBirthValidator({ value: '20/07/1990' })).toEqual({
                valid: false,
                message: 'Invalid date.',
            });
        });

        it('should return invalid when received date under 18 year old.', () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 17);
            expect(dateOfBirthValidator({ value: date })).toEqual({
                valid: false,
                message: 'You must be over 18 years old.',
            });
        });

        it('should return valid when received date string over 18 year old.', () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 20);
            const value = date.toISOString();
            expect(dateOfBirthValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'valid date.',
            });
        });
    });

    describe('isDateString', () => {
        it('Must return valid for string with international standard date.', () => {
            const value = '2000-01-01';
            expect(isDateString({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid date string.',
            });
        });

        it('Must return valid for string iso with international standard date.', () => {
            const value = '2000-01-01T00:00:00Z';
            expect(isDateString({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid date string.',
            });
        });

        it('Must return valid for string iso with timezone and international standard date.', () => {
            const value = '2000-01-01T00:00:00.000Z';
            expect(isDateString({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid date string.',
            });
        });

        it('Must return valid for string with Brazilian standard date.', () => {
            const value = '01/01/2000';
            expect(isDateString({ value })).toEqual({
                valid: true,
                value,
                message: 'Valid date string.',
            });
        });

        it('Should return invalid when received a string invalid.', () => {
            expect(isDateString({ value: '0.01.2000' })).toEqual({
                valid: false,
                message: 'Please enter a valid date string.',
            });
        });

        it('should return a required field error for missing date string.', () => {
            expect(isDateString({ value: undefined })).toEqual(REQUIRED_FIELD);
        });

        it('should return a type error for non string date.', () => {
            expect(isDateString({ value: 1 })).toEqual(INVALID_TYPE);
        });
    });
});