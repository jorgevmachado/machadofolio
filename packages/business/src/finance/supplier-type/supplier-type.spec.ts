import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { SUPPLIER_TYPE_MOCK } from '../mock';

import SupplierType from './supplier-type';
import type { SupplierTypeEntity } from './types';

describe('SupplierType', () => {
    const supplierTypeMock = SUPPLIER_TYPE_MOCK as unknown as SupplierTypeEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            const params = supplierTypeMock;

            const result = new SupplierType(params);

            expect(result.id).toBe(params.id);
            expect(result.name).toBe(params.name);
            expect(result.created_at).toEqual(params.created_at);
            expect(result.updated_at).toEqual(params.updated_at);
            expect(result.deleted_at).toBe(params.deleted_at);
        });

        it('should create an instance with minimal valid data', () => {
            const params = {
                name: 'Supplier B',
            };

            const result = new SupplierType(params);

            expect(result.id).toBeUndefined();
            expect(result.name).toBe(params.name);
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
        });

        it('should allow instantiation with no parameters', () => {
            const result = new SupplierType();

            expect(result.id).toBeUndefined();
            expect(result.name).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
        });
    });
});