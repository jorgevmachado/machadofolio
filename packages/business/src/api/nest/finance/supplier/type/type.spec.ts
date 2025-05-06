import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import type { QueryParameters } from '../../../../../types';

import { NestModuleAbstract } from '../../../abstract';

import { SupplierType } from './type';

jest.mock('../../../abstract');

describe('SupplierType', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let supplierType: SupplierType;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        supplierType = new SupplierType(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should initialize with the correct path and config', () => {
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'finance/supplier',
                subPathUrl: 'type',
                nestModuleConfig: mockConfig,
            });
        });

        it('should call inherited methods from NestModuleAbstract about supplierType', async () => {
            const mockGetAll = jest
                .spyOn(NestModuleAbstract.prototype, 'getAll')
                .mockResolvedValue([]);

            const queryParams: QueryParameters = { name: 'test' };
            const result = await supplierType.getAll(queryParams);

            expect(mockGetAll).toHaveBeenCalledTimes(1);
            expect(mockGetAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });
    });
});