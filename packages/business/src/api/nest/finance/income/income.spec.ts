import { Income } from './income';

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

jest.mock('./source', () => ({ IncomeSource: jest.fn() }));

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import type { QueryParameters } from '../../../../types';
import { IncomeSource } from './source';

describe('Income', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let income: Income;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        income = new Income(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should call inherited methods from NestModuleAbstract about income', async () => {
            (income.getAll as any).mockResolvedValue([]);
            const queryParams: QueryParameters = { name: 'test' };
            const result = await income.getAll(queryParams);
            expect(income.getAll).toHaveBeenCalledTimes(1);
            expect(income.getAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });

        describe('incomeSourceModule', () => {
            it('should initialize IncomeSource module', () => {
                expect(IncomeSource).toHaveBeenCalledTimes(1);
                expect(IncomeSource).toHaveBeenCalledWith(mockConfig);
            });

            it('should return the instance of IncomeSource via source getter', () => {
                const sourceModule = income.source;
                expect(sourceModule).toBeInstanceOf(IncomeSource);
                expect(IncomeSource).toHaveBeenCalledTimes(1);
            });
        });
    })
})