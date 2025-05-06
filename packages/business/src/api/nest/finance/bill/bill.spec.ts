import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { NestModuleAbstract } from '../../abstract';

import { Bill } from './bill';
import { BillCategory } from './category';
import { Expense } from './expense';

jest.mock('../../abstract');
jest.mock('./category');
jest.mock('./expense');

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

    describe('constructor', () => {
        it('should initialize with the correct path and config bill', () => {
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'finance/bill',
                nestModuleConfig: mockConfig,
            });
        });
    });

    describe('billCategoryModule', () => {
        it('should initialize billCategory module', () => {
            expect(BillCategory).toHaveBeenCalledTimes(1);
            expect(BillCategory).toHaveBeenCalledWith(mockConfig);
        });
        it('should return the instance of billCategory via type getter', () => {
            const categoryModule = bill.category;
            expect(categoryModule).toBeInstanceOf(BillCategory);
            expect(BillCategory).toHaveBeenCalledTimes(1);
        });
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