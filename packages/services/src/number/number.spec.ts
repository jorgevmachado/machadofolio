import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import {
    ensureOrderNumber,
    extractLastNumberFromUrl,
    isNumberEven,
    numberValidator,
} from './number';
import { INVALID_TYPE } from '../shared';

describe('Number function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('extractLastNumberFromUrl', () => {
        it('should return a number when the string is received', () => {
            expect(extractLastNumberFromUrl('https://www.google.com/123')).toEqual(
                123,
            );
        });

        it('should return a 0 when the url is undefined', () => {
            expect(extractLastNumberFromUrl()).toEqual(0);
        });

        it('should return 0 if the last item in the URL is not a number', () => {
            expect(extractLastNumberFromUrl('https://www.google.com/abc')).toEqual(0);
        });

        it('should return 0 if the URL is empty', () => {
            expect(extractLastNumberFromUrl('')).toEqual(0);
        });

        it('should return the correct number when the URL ends with a mix of numbers and strings', () => {
            expect(extractLastNumberFromUrl('https://www.google.com/123abc')).toEqual(
                0,
            );
        });
    });

    describe('isNumberEven', () => {
        it('should return true for an even number', () => {
            expect(isNumberEven(4)).toBe(true);
        });

        it('should return false for an odd number', () => {
            expect(isNumberEven(3)).toBe(false);
        });

        it('should throw an error for a decimal number', () => {
            expect(() => isNumberEven(3.5)).toThrow('Please enter a integer number');
        });

        it('should return true for a negative even number', () => {
            expect(isNumberEven(-2)).toBe(true);
        });

        it('should return false for a negative odd number', () => {
            expect(isNumberEven(-3)).toBe(false);
        });
    });

    describe('numberValidator', () => {
        it('should return valid when received valid number', () => {
            const value = '7';
            expect(numberValidator({ value })).toEqual({
                valid: true,
                value,
                message: 'valid number.',
            });
        });

        it('should return invalid when received invalid number', () => {
            expect(numberValidator({ value: 'seven' })).toEqual({
                valid: false,
                message: 'Please enter a valid number.',
            });
        });

        it('should return invalid when received empty param', () => {
            expect(numberValidator({})).toEqual({
                valid: false,
                message: 'Please enter a valid number.',
            });
        });

        it('should return invalid when received invalid param', () => {
            expect(numberValidator({ value: new Date() })).toEqual(INVALID_TYPE);
        });
    });

    describe('ensureOrderNumber', () => {
        it('should return the value of order if provided', () => {
            const result = ensureOrderNumber(42, 'any-url');
            expect(result).toBe(42);
        });

        it('should return 0 if no order or URL is given', () => {
            const result = ensureOrderNumber(undefined, undefined);
            expect(result).toBe(0);
        });

        it('should return the number extracted from the URL if order is not provided.', () => {
            const result = ensureOrderNumber(undefined, 'https://example.com/99');
            expect(result).toBe(99);
        });
    });
});