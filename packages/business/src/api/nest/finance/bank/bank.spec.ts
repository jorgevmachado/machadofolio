jest.mock('../../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();
        public getAll = jest.fn<(...args: any[]) => Promise<any>>();
        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
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

import type { QueryParameters } from '../../../../types';

import { Bank } from './bank';

describe('Bank', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let bank: Bank;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        bank = new Bank(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should call inherited methods from NestModuleAbstract about bank', async () => {
            (bank.getAll as any).mockResolvedValue([]);

            const queryParams: QueryParameters = { name: 'test' };
            const result = await bank.getAll(queryParams);

            expect(bank.getAll).toHaveBeenCalledTimes(1);
            expect(bank.getAll).toHaveBeenCalledWith(queryParams);
            expect(result).toEqual([]);
        });
    });
});