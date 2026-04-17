import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { FINANCE_MOCK } from './mock';
import Finance from './finance';
import type { FinanceEntity } from './types';


describe('Finance', () => {
    const financeMock: FinanceEntity = FINANCE_MOCK as unknown as FinanceEntity;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Constructor', () => {
        it('should create an instance with all provided parameters', () => {
            const finance = new Finance(financeMock);
            expect(finance).toBeInstanceOf(Finance);
            expect(finance.id).toBe(financeMock.id);
            expect(finance.user).toBe(financeMock.user);
            expect(finance.bills).toBe(financeMock.bills);
            expect(finance.created_at).toEqual(
                financeMock.created_at,
            );
            expect(finance.updated_at).toEqual(
                financeMock.updated_at,
            );
            expect(finance.deleted_at).toBe(financeMock.deleted_at);
        });
        it('should create an instance with some provided parameters', () => {
            const finance = new Finance({
                user: financeMock.user,
            });
            expect(finance).toBeInstanceOf(Finance);
            expect(finance.id).toBeUndefined();
            expect(finance.user).toBe(financeMock.user);
            expect(finance.bills).toBeUndefined();
            expect(finance.created_at).toBeUndefined();
            expect(finance.updated_at).toBeUndefined();
            expect(finance.deleted_at).toBeUndefined();
        });
        it('should initialize fields with default values when no parameters are provided', () => {
            const finance = new Finance();
            expect(finance.id).toBeUndefined();
            expect(finance.user).toBeUndefined();
            expect(finance.bills).toBeUndefined();
            expect(finance.created_at).toBeUndefined();
            expect(finance.updated_at).toBeUndefined();
            expect(finance.deleted_at).toBeUndefined();
        });
    });
});