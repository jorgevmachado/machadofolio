import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { INCOME_MOCK } from '../mock';

import type { IncomeConstructorParams, IncomeEntity } from './types';
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
        it('should create an instance with all parameters when valid data is provided', () => {
            const params: IncomeConstructorParams = mockEntity;

            const result = new Income(params);

            expect(result.id).toBe(params.id);
            expect(result.name).toBe(params.name);
            expect(result.created_at).toEqual(params.created_at);
            expect(result.updated_at).toEqual(params.updated_at);
            expect(result.deleted_at).toBeUndefined();
        });

        it('should create an instance with minimal valid data', () => {
            const params: IncomeConstructorParams = {
                name: 'Salary',
                total: 100,
                source: mockEntity.source,
                finance: mockEntity.finance,
                received_at: mockEntity.created_at,
            };

            const result = new Income(params);

            expect(result.id).toBeUndefined();
            expect(result.name).toBe(params.name);
            expect(result.total).toBe(params.total);
            expect(result.source).toBe(params.source);
            expect(result.finance).toBe(params.finance);
            expect(result.name_code).toBe(params.name.toLowerCase());
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.received_at).toEqual(params.received_at);
        });

        it('should allow instantiation with no parameters', () => {
            const result = new Income();

            expect(result.id).toBeUndefined();
            expect(result.name).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
        });
    });
});