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

jest.mock('./expense', () => ({ Expense: jest.fn() }));

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Bill } from './bill';
import { Expense } from './expense';

describe('Bill', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let bill: Bill;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        bill = new Bill(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('expenseModule', () => {
        it('should initialize expense module', () => {
            expect(Expense).toHaveBeenCalledTimes(1);
            expect(Expense).toHaveBeenCalledWith(mockConfig);
        });
        it('should return the instance of expense via type getter', () => {
            const expenseModule = bill.expense;
            expect(expenseModule).toBeInstanceOf(Expense);
            expect(Expense).toHaveBeenCalledTimes(1);
        });
    });
});