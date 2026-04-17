jest.mock('../../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public subPathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();
        public getAll = jest.fn<(...args: any[]) => Promise<any>>();
        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
            this.subPathUrl = config?.subPathUrl;
        }
    }

    return { NestModuleAbstract };
});

jest.mock('./type', () => ({ SupplierType: jest.fn() }));

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