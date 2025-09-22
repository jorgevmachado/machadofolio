import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { INCOME_MOCK } from '../mock';

import type { IncomeEntity } from './types';
import Income from './income';

describe('Income', () => {
    const mockEntity = INCOME_MOCK as unknown as IncomeEntity;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance with default values when no parameters are provided', () => {
            const result = new Income();
            expect(result).toBeInstanceOf(Income);
            expect(result.id).toBeUndefined();
            expect(result.year).toEqual(new Date().getFullYear());
            expect(result.name).toBeUndefined();
            expect(result.total).toBeUndefined();
            expect(result.source).toBeUndefined();
            expect(result.months).toHaveLength(0);
            expect(result.finance).toBeUndefined();
            expect(result.name_code).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.description).toBeUndefined();
        });

        it('should create an instance when receiving only mandatory parameters', () => {
            const result = new Income({
                name: 'Salary',
                total: 100,
                source: mockEntity.source,
                finance: mockEntity.finance,
            });
            expect(result).toBeInstanceOf(Income);
            expect(result.id).toBeUndefined();
            expect(result.year).toEqual(new Date().getFullYear());
            expect(result.name).toBe('Salary');
            expect(result.total).toBe(100);
            expect(result.source).toBe(mockEntity.source);
            expect(result.months).toHaveLength(0);
            expect(result.finance).toBe(mockEntity.finance);
            expect(result.name_code).toBe('salary');
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.description).toBeUndefined();
        });

        it('should create an instance when receiving all parameters', () => {
            const result = new Income(mockEntity);
            expect(result).toBeInstanceOf(Income);
            expect(result.id).toBe(mockEntity.id);
            expect(result.year).toBe(mockEntity.year);
            expect(result.name).toBe(mockEntity.name);
            expect(result.total).toBe(mockEntity.total);
            expect(result.source).toBe(mockEntity.source);
            expect(result.months).toHaveLength(mockEntity.months.length);
            expect(result.finance).toBe(mockEntity.finance);
            expect(result.name_code).toBe(mockEntity.name_code);
            expect(result.created_at).toBe(mockEntity.created_at);
            expect(result.updated_at).toBe(mockEntity.updated_at);
            expect(result.deleted_at).toBe(mockEntity.deleted_at);
            expect(result.description).toBe(mockEntity.description);
        });

    });
});