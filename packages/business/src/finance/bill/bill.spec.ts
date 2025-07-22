import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { BILL_MOCK } from '../mock';

import type { BillConstructorParams, BillEntity } from './types';

import Bill from './bill';

describe('Bill', () => {
    const billMock: BillEntity = BILL_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });
    
    describe('Constructor', () => {
        it('should create an instance with all parameters when valid data is provided', () => {
            const bill = new Bill(billMock);

            expect(bill.id).toBe(billMock.id);
            expect(bill.name).toBe(billMock.name);
            expect(bill.bank).toBe(billMock.bank);
            expect(bill.type).toBe(billMock.type);
            expect(bill.created_at).toEqual(billMock.created_at);
            expect(bill.updated_at).toEqual(billMock.updated_at);
            expect(bill.deleted_at).toBe(billMock.deleted_at);
        });

        it('should create an instance with minimal valid data', () => {
            const params: BillConstructorParams = {
                bank: billMock.bank,
                name: billMock.name,
                type: billMock.type,
                group: billMock.group,
                finance: billMock.finance
            };

            const bill = new Bill(params);

            expect(bill.year).toBe(new Date().getFullYear());
            expect(bill.bank).toBe(params.bank);
            expect(bill.name).toBe(params.name);
            expect(bill.type).toBe(params.type);
            expect(bill.group).toBe(params.group);
            expect(bill.created_at).toBeUndefined();
            expect(bill.updated_at).toBeUndefined();
            expect(bill.deleted_at).toBeUndefined();
        });

        it('should allow instantiation with no parameters', () => {
            const bill = new Bill();

            expect(bill.id).toBeUndefined();
            expect(bill.year).toBe(new Date().getFullYear());
            expect(bill.name).toBeUndefined();
            expect(bill.created_at).toBeUndefined();
            expect(bill.updated_at).toBeUndefined();
            expect(bill.deleted_at).toBeUndefined();
        });
    });
});