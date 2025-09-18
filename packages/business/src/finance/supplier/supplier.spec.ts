import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { ERROR_STATUS_CODE, Error } from '@repo/services';

import { SUPPLIER_MOCK } from '../mock';

import type { SupplierConstructorParams, SupplierEntity } from './types';

import Supplier from './supplier';

describe('Supplier', () => {
    const supplierMock = SUPPLIER_MOCK as unknown as SupplierEntity;
    const params: SupplierConstructorParams = {
        id: supplierMock.id,
        name: supplierMock.name,
        type: supplierMock.type,
        created_at: supplierMock.created_at,
        updated_at: supplierMock.updated_at,
        deleted_at: supplierMock.deleted_at,
        description: supplierMock.description,
    };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    
    describe('Constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            const supplier = new Supplier(params);

            expect(supplier.id).toBe(params.id);
            expect(supplier.name).toBe(params.name);
            expect(supplier.type).toBe(params.type);
            expect(supplier.created_at).toEqual(params.created_at);
            expect(supplier.updated_at).toEqual(params.updated_at);
            expect(supplier.deleted_at).toBeUndefined();
            expect(supplier.description).toBe(params.description);
        });

        it('should create an instance with minimal valid data', () => {
            const params = {
                name: supplierMock.name,
                type: supplierMock.type,
            };

            const supplier = new Supplier(params);

            expect(supplier.name).toBe(params.name);
            expect(supplier.type).toBe(params.type);
            expect(supplier.created_at).toBeUndefined();
            expect(supplier.updated_at).toBeUndefined();
            expect(supplier.deleted_at).toBeUndefined();
            expect(supplier.description).toBeUndefined();
        });

        it('should throw an error when name is missing', () => {
            const params = {
                type: {
                    id: '1',
                    name: 'Supplier A',
                    created_at: new Date('2023-01-01'),
                    updated_at: new Date('2023-01-02'),
                    deleted_at: undefined,
                },
                created_at: new Date('2023-01-01'),
            };

            expect(() => new Supplier(params as SupplierEntity)).toThrow(
                new Error({
                    statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION,
                    message: 'name is required',
                }),
            );
        });

        it('should throw an error when type is missing', () => {
            const params = {
                name: 'Supplier C',
                description: 'Handles logistics and transport.',
            };

            expect(() => new Supplier(params as SupplierEntity)).toThrow(
                new Error({
                    statusCode: ERROR_STATUS_CODE.CONFLICT_EXCEPTION,
                    message: 'type is required',
                }),
            );
        });

        it('should allow instantiation with no parameters', () => {
            const supplier = new Supplier();

            expect(supplier.id).toBeUndefined();
            expect(supplier.name).toBeUndefined();
            expect(supplier.type).toBeUndefined();
            expect(supplier.created_at).toBeUndefined();
            expect(supplier.updated_at).toBeUndefined();
            expect(supplier.deleted_at).toBeUndefined();
            expect(supplier.description).toBeUndefined();
        });

        it('should fill default values for optional fields if they are undefined', () => {
            const params = {
                name: supplierMock.name,
                type: supplierMock.type,
            };

            const supplier = new Supplier(params);

            expect(supplier.name).toBe(params.name);
            expect(supplier.type).toBe(params.type);
            expect(supplier.created_at).toBeUndefined();
            expect(supplier.updated_at).toBeUndefined();
            expect(supplier.deleted_at).toBeUndefined();
            expect(supplier.description).toBeUndefined();
        });
    });
});