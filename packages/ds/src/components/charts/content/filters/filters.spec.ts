import { compareFilter } from './filters';
import type { CompareFilterParams } from '../types';

describe('compareFilter', () => {
    it('returns false when condition is "empty" and param is falsy', () => {
        const params: CompareFilterParams = { param: undefined, condition: 'empty', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(false);
    });

    it('returns true when param is falsy and condition is not "empty"', () => {
        const params: CompareFilterParams = { param: undefined, condition: '===', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
    });

    it('returns true when condition is falsy', () => {
        const params = { param: 10, condition: undefined, by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(true);
    });

    it('compares using ===', () => {
        const params: CompareFilterParams = { param: 10, condition: '===', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
        const params2: CompareFilterParams = { param: 5, condition: '===', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(false);
    });

    it('compares using !==', () => {
        const params: CompareFilterParams = { param: 10, condition: '!==', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(false);
        const params2: CompareFilterParams = { param: 5, condition: '!==', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(true);
    });

    it('compares using >', () => {
        const params: CompareFilterParams = { param: 11, condition: '>', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
        const params2: CompareFilterParams = { param: 9, condition: '>', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(false);
    });

    it('compares using <', () => {
        const params: CompareFilterParams = { param: 9, condition: '<', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
        const params2: CompareFilterParams = { param: 11, condition: '<', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(false);
    });

    it('compares using >=', () => {
        const params: CompareFilterParams = { param: 10, condition: '>=', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
        const params2: CompareFilterParams = { param: 9, condition: '>=', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(false);
    });

    it('compares using <=', () => {
        const params: CompareFilterParams = { param: 10, condition: '<=', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
        const params2: CompareFilterParams = { param: 11, condition: '<=', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(false);
    });

    it('returns true for unknown condition', () => {
        const params = { param: 10, condition: 'unknown', by: 'value', value: 10, label: 'ten' };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(true);
    });

    it('uses label when by is "label"', () => {
        const params: CompareFilterParams = { param: 'ten', condition: '===', by: 'label', value: 10, label: 'ten' };
        expect(compareFilter(params)).toBe(true);
        const params2: CompareFilterParams = { param: 'eleven', condition: '===', by: 'label', value: 10, label: 'ten' };
        expect(compareFilter(params2)).toBe(false);
    });

    it('handles null/undefined currentValue for numeric comparisons', () => {
        const params  = { param: 1, condition: '>', by: 'value', value: undefined, label: undefined };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(true);
        const params2 = { param: -1, condition: '<', by: 'value', value: undefined, label: undefined };
        expect(compareFilter(params2 as unknown as CompareFilterParams)).toBe(true);
    });

    it('returns true for ">=" when param is 0 and currentValue is undefined', () => {
        const params = { param: 0, condition: '>=', by: 'value', value: undefined, label: undefined };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(true);
    });

    it('returns true for "<=" when param is 0 and currentValue is undefined', () => {
        const params = { param: 0, condition: '<=', by: 'value', value: undefined, label: undefined };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(true);
    });

    it('returns false for ">=" when param is -1 and currentValue is undefined', () => {
        const params = { param: -1, condition: '>=', by: 'value', value: undefined, label: undefined };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(false);
    });

    it('returns false for "<=" when param is 1 and currentValue is undefined', () => {
        const params = { param: 1, condition: '<=', by: 'value', value: undefined, label: undefined };
        expect(compareFilter(params as unknown as CompareFilterParams)).toBe(false);
    });
});