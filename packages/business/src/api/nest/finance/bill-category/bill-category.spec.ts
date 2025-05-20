import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import type { QueryParameters } from '../../../../types';

import { NestModuleAbstract } from '../../abstract';

import { BillCategory } from './bill-category';

jest.mock('../../abstract');

describe('BillCategory', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let billCategory: BillCategory;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        billCategory = new BillCategory(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should initialize with the correct path and config', () => {
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'finance',
                subPathUrl: 'bill-category',
                nestModuleConfig: mockConfig,
            });
        });

        it('should call inherited methods from NestModuleAbstract about billCategory', async () => {
            const mockGetAll = jest
                .spyOn(NestModuleAbstract.prototype, 'getAll')
                .mockResolvedValue([]);

            const queryParams: QueryParameters = { name: 'test' };
            const result = await billCategory.getAll(queryParams);

            expect(mockGetAll).toHaveBeenCalledTimes(1);
            expect(mockGetAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });
    });
});