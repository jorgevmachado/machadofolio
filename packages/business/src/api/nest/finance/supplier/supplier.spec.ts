import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { NestModuleAbstract } from '../../abstract';

import { Supplier } from './supplier';
import { SupplierType } from './type';

jest.mock('../../abstract');
jest.mock('./type');

describe('Supplier', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let supplier: Supplier;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        supplier = new Supplier(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should initialize with the correct path and config', () => {
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'finance/supplier',
                nestModuleConfig: mockConfig,
            });
        });

        describe('supplierTypeModule', () => {
            it('should initialize SupplierType module', () => {
                expect(SupplierType).toHaveBeenCalledTimes(1);
                expect(SupplierType).toHaveBeenCalledWith(mockConfig);
            });
            it('should return the instance of SupplierType via type getter', () => {
                const typeModule = supplier.type;
                expect(typeModule).toBeInstanceOf(SupplierType);
                expect(SupplierType).toHaveBeenCalledTimes(1);
            });
        });
    });
});