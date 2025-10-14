import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { INCOME_SOURCE_MOCK } from '../mock';

import type { IncomeSourceEntity } from './types';
import IncomeSource from './income-source';

describe('IncomeSource', () => {
    const mockEntity = INCOME_SOURCE_MOCK as unknown as IncomeSourceEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            const params = mockEntity;

            const result = new IncomeSource(params);

            expect(result.id).toBe(params.id);
            expect(result.name).toBe(params.name);
            expect(result.created_at).toEqual(params.created_at);
            expect(result.updated_at).toEqual(params.updated_at);
            expect(result.deleted_at).toBe(params.deleted_at);
        });

        it('should create an instance with minimal valid data', () => {
            const params = {
                name: 'job',
            };

            const result = new IncomeSource(params);

            expect(result.id).toBeUndefined();
            expect(result.name).toBe(params.name);
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
        });

        it('should allow instantiation with no parameters', () => {
            const result = new IncomeSource();

            expect(result.id).toBeUndefined();
            expect(result.name).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
        });
    })
});