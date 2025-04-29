import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { INVALID_TYPE, REQUIRED_FIELD } from '../../shared';

import { parseYear, yearValidator } from './year';


describe('Date Year function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Year function', () => {
        describe('yearValidator', () => {
            it('should return valid when received valid year', () => {
                expect(yearValidator({ value: 2021 })).toEqual({
                    valid: true,
                    value: 2021,
                    message: 'Valid year.',
                });
            });

            it('should return invalid when received invalid year', () => {
                expect(yearValidator({ value: 99999 })).toEqual({
                    valid: false,
                    message: 'Please enter a valid year.',
                });
            });

            it('should return invalid when received undefined year', () => {
                expect(yearValidator({})).toEqual(REQUIRED_FIELD);
            });

            it('should return invalid when received invalid year type', () => {
                expect(yearValidator({ value: '2022' })).toEqual(INVALID_TYPE);
            });
        });

        describe('parseYear', () => {
            it('should return the year when it is between 1000 and 9999.', () => {
                expect(parseYear('2023')).toBe(2023);
                expect(parseYear(1999)).toBe(1999);
            });

            it('should return undefined for a year outside the allowed range.', () => {
                expect(parseYear('999')).toBeUndefined();
                expect(parseYear('10000')).toBeUndefined();
            });

            it('should return undefined for invalid inputs.', () => {
                expect(parseYear('abc')).toBeUndefined();
                expect(parseYear(undefined)).toBeUndefined();
                expect(parseYear('')).toBeUndefined();
            });
        });
    });
});