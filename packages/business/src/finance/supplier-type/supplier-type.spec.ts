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

describe('SupplierType', () => {
    const supplierTypeMock = SUPPLIER_TYPE_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        xit('should create an instance with all parameters when valid data is provided', () => {
            const params = supplierTypeMock;

            const supplierType = new SupplierType(params);

            expect(supplierType.id).toBe(params.id);
            expect(supplierType.name).toBe(params.name);
            expect(supplierType.created_at).toEqual(params.created_at);
            expect(supplierType.updated_at).toEqual(params.updated_at);
            expect(supplierType.deleted_at).toBe(params.deleted_at);
        });

        xit('should create an instance with minimal valid data', () => {
            const params = {
                name: 'Supplier B',
            };

            const supplierType = new SupplierType(params);

            expect(supplierType.id).toBeUndefined();
            expect(supplierType.name).toBe(params.name);
            expect(supplierType.created_at).toBeUndefined();
            expect(supplierType.updated_at).toBeUndefined();
            expect(supplierType.deleted_at).toBeUndefined();
        });

        xit('should allow instantiation with no parameters', () => {
            const supplierType = new SupplierType();

            expect(supplierType.id).toBeUndefined();
            expect(supplierType.name).toBeUndefined();
            expect(supplierType.created_at).toBeUndefined();
            expect(supplierType.updated_at).toBeUndefined();
            expect(supplierType.deleted_at).toBeUndefined();
        });
    });
});