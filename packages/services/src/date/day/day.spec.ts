import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { INVALID_TYPE, REQUIRED_FIELD } from '../../shared';

import { dayValidator, parseDay } from './day';


describe('Date day function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Day function', () => {
        describe('dayValidator', () => {
            it('Should return a valid for day equal 1.', () => {
                expect(dayValidator({ value: 1 })).toEqual({
                    valid: true,
                    value: 1,
                    message: 'Valid day.',
                });
            });

            it('Should return a valid for day equal 31.', () => {
                expect(dayValidator({ value: 31 })).toEqual({
                    valid: true,
                    value: 31,
                    message: 'Valid day.',
                });
            });

            it('must return valid for days between 1 and 31.', () => {
                expect(dayValidator({ value: 15 })).toEqual({
                    valid: true,
                    value: 15,
                    message: 'Valid day.',
                });
            });

            it('should return invalid for days outside the range equal 0', () => {
                expect(dayValidator({ value: 0 })).toEqual({
                    valid: false,
                    value: undefined,
                    message: 'Please enter a valid day.',
                });
            });

            it('should return invalid for days outside the range equal 32', () => {
                expect(dayValidator({ value: 32 })).toEqual({
                    valid: false,
                    value: undefined,
                    message: 'Please enter a valid day.',
                });
            });

            it('should return invalid for days outside the range equal -5', () => {
                expect(dayValidator({ value: -5 })).toEqual({
                    valid: false,
                    value: undefined,
                    message: 'Please enter a valid day.',
                });
            });

            it('should return a type error for non-numeric inputs.', () => {
                expect(dayValidator({ value: '15th' })).toEqual(INVALID_TYPE);
            });

            it('should return a required field error for missing entries.', () => {
                expect(dayValidator({ value: undefined })).toEqual(REQUIRED_FIELD);
            });
        });

        describe('parseDay', () => {
            it('should return the day for valid entries (1-31).', () => {
                expect(parseDay('1')).toBe(1);
                expect(parseDay('31')).toBe(31);
            });

            it('should return undefined for days outside the allowed range.', () => {
                expect(parseDay('0')).toBeUndefined();
                expect(parseDay('32')).toBeUndefined();
                expect(parseDay('-1')).toBeUndefined();
            });

            it('should return undefined for invalid inputs.', () => {
                expect(parseDay('abc')).toBeUndefined();
                expect(parseDay(undefined)).toBeUndefined();
                expect(parseDay('')).toBeUndefined();
            });
        });
    });
});