jest.mock('../../../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public subPathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();
        public getAll = jest.fn<(...args: any[]) => Promise<any>>();
        public getOne = jest.fn<(...args: any[]) => Promise<any>>();
        public delete = jest.fn<(...args: any[]) => Promise<any>>();
        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
            this.subPathUrl = config?.subPathUrl;
        }
    }

    return { NestModuleAbstract };
});

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import type { QueryParameters } from '../../../../../types';

import { IncomeSource } from './source';

describe('IncomeSource', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let incomeSource: IncomeSource;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        incomeSource = new IncomeSource(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should call inherited methods from NestModuleAbstract about incomeSource', async () => {
            (incomeSource.getAll as any).mockResolvedValue([]);
            const queryParams: QueryParameters = { name: 'test' };
            const result = await incomeSource.getAll(queryParams);
            expect(incomeSource.getAll).toHaveBeenCalledTimes(1);
            expect(incomeSource.getAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        })
    });
})