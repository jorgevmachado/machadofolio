import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { BILL_MOCK } from '../mock';
import type Bill from '../bill';

import { EXPENSE_MOCK } from '../../expense';
import type Expense from '../../expense';

import BillBusiness from './business';

describe('Bill Business', () => {
    let business: BillBusiness;
    const mockEntity: Bill = BILL_MOCK;
    const mockExpenses: Array<Expense> = [EXPENSE_MOCK];
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        business = new BillBusiness();
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('calculate', () => {
        it('should calculate bill without expenses', () => {
            const result = business.calculate(mockEntity);
            expect(result.total).toBe(0);
            expect(result.total_paid).toBe(0);
            expect(result.all_paid).toBeFalsy();
        });

        it('should calculate bill with expenses', () => {
            const result = business.calculate({ ...mockEntity, expenses: mockExpenses });
            expect(result.total).toBe(100);
            expect(result.total_paid).toBe(0);
            expect(result.all_paid).toBeFalsy();
        });
    });
});