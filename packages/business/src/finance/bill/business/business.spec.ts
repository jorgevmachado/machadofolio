import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { BILL_MOCK, EXPENSE_PARENT_MOCK } from '../../mock';

jest.mock('../enum', () => ({
    EBillType: {
        PIX: 'PIX',
        BANK_SLIP: 'BANK_SLIP',
        CREDIT_CARD: 'CREDIT_CARD',
        ACCOUNT_DEBIT: 'ACCOUNT_DEBIT',
    }
}));

jest.mock('./spreadsheet', () => {
    class SpreadsheetBusinessMock {
    }

    return { BillSpreadsheetBusiness: SpreadsheetBusinessMock }
});

import type { ExpenseEntity } from '../../expense';

import type Bill from '../bill';
import { EBillType } from '../enum';

import BillBusiness from './business';
import { BillSpreadsheetBusiness } from './spreadsheet';

describe('Bill Business', () => {
    let business: BillBusiness;

    const mockEntity: Bill = BILL_MOCK as unknown as Bill;
    const mockExpense: ExpenseEntity = EXPENSE_PARENT_MOCK as unknown as ExpenseEntity;
    const mockExpenses: Array<ExpenseEntity> = [mockExpense];
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        business = new BillBusiness();
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('BillSpreadsheetBusiness Module', () => {
        it('should return the instance of BillSpreadsheetBusiness via spreadsheet getter', () => {
            expect(business.spreadsheet).toBeInstanceOf(BillSpreadsheetBusiness);
        });
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

        it('Should calculate even when expense[property] is undefined.', () => {
            const bill = {
                expenses: [
                    { total: undefined, total_paid: undefined, paid: true }
                ]
            } as any;

            const sumSpy = jest.spyOn(business as any, 'sumTotalExpenses');

            const result = business.calculate(bill);

            expect(sumSpy).toHaveBeenCalledWith(bill.expenses, 'total');
            expect(sumSpy).toHaveBeenCalledWith(bill.expenses, 'total_paid');

            expect(result.total).toBe(0);
            expect(result.total_paid).toBe(0);

            expect(result.all_paid).toBe(true);

            sumSpy.mockRestore();
        });

    });

    describe('mapBillListByFilter', () => {
        const mockList: Array<Bill> = [
            mockEntity,
            {
                ...mockEntity,
                type: EBillType.BANK_SLIP,
                bank: {...mockEntity.bank, name: 'Caixa'},
                group: {...mockEntity.group, name: 'Monte Carlo Residential'},
            },
            {
                ...mockEntity,
                type: EBillType.PIX,
                bank: {...mockEntity.bank, name: 'Itaú'},
                group: {...mockEntity.group, name: 'Ingrid Residential'},
            },
            {
                ...mockEntity,
                type: EBillType.ACCOUNT_DEBIT,
                bank: {...mockEntity.bank, name: 'Santander'},
                group: {...mockEntity.group, name: 'Mother'},
            },
        ]
        it('should return a list of bills filtered by type empty.', () => {
            const result = business.mapBillListByFilter([], 'type');
            expect(result).toEqual([]);
        });

        it('should return a list of bills filtered by type.', () => {
            const result = business.mapBillListByFilter(mockList, 'type');
            expect(result[0]).toEqual({
                title: 'credit_card',
                list: [mockEntity],
                type: 'type'
            });
            expect(result[1]).toEqual({
                title: 'bank_slip',
                list: [{
                    ...mockEntity,
                    type: EBillType.BANK_SLIP,
                    bank: {...mockEntity.bank, name: 'Caixa'},
                    group: {...mockEntity.group, name: 'Monte Carlo Residential'},
                }],
                type: 'type'
            },);
            expect(result[2]).toEqual({
                title: 'pix',
                list: [{
                    ...mockEntity,
                    type: EBillType.PIX,
                    bank: {...mockEntity.bank, name: 'Itaú'},
                    group: {...mockEntity.group, name: 'Ingrid Residential'},
                }],
                type: 'type'
            });
            expect(result[3]).toEqual({
                title: 'account_debit',
                list: [{
                    ...mockEntity,
                    type: EBillType.ACCOUNT_DEBIT,
                    bank: {...mockEntity.bank, name: 'Santander'},
                    group: {...mockEntity.group, name: 'Mother'},
                }],
                type: 'type'
            });
        });

        it('should return a list of bills filtered by group.', () => {
            const result = business.mapBillListByFilter(mockList, 'group');
            expect(result[0]).toEqual({
                title: 'Personal',
                list: [mockEntity],
                type: 'group'
            });
            expect(result[1]).toEqual({
                title: 'Monte Carlo Residential',
                list: [{
                    ...mockEntity,
                    type: EBillType.BANK_SLIP,
                    bank: {...mockEntity.bank, name: 'Caixa'},
                    group: {...mockEntity.group, name: 'Monte Carlo Residential'},
                }],
                type: 'group'
            },);
            expect(result[2]).toEqual({
                title: 'Ingrid Residential',
                list: [{
                    ...mockEntity,
                    type: EBillType.PIX,
                    bank: {...mockEntity.bank, name: 'Itaú'},
                    group: {...mockEntity.group, name: 'Ingrid Residential'},
                }],
                type: 'group'
            });
            expect(result[3]).toEqual({
                title: 'Mother',
                list: [{
                    ...mockEntity,
                    type: EBillType.ACCOUNT_DEBIT,
                    bank: {...mockEntity.bank, name: 'Santander'},
                    group: {...mockEntity.group, name: 'Mother'},
                }],
                type: 'group'
            });
        });

        it('should return a list of bills filtered by bank.', () => {
            const result = business.mapBillListByFilter(mockList, 'bank');
            expect(result[0]).toEqual({
                title: 'Nubank',
                list: [mockEntity],
                type: 'bank'
            });
            expect(result[1]).toEqual({
                title: 'Caixa',
                list: [{
                    ...mockEntity,
                    type: EBillType.BANK_SLIP,
                    bank: {...mockEntity.bank, name: 'Caixa'},
                    group: {...mockEntity.group, name: 'Monte Carlo Residential'},
                }],
                type: 'bank'
            },);
            expect(result[2]).toEqual({
                title: 'Itaú',
                list: [{
                    ...mockEntity,
                    type: EBillType.PIX,
                    bank: {...mockEntity.bank, name: 'Itaú'},
                    group: {...mockEntity.group, name: 'Ingrid Residential'},
                }],
                type: 'bank'
            });
            expect(result[3]).toEqual({
                title: 'Santander',
                list: [{
                    ...mockEntity,
                    type: EBillType.ACCOUNT_DEBIT,
                    bank: {...mockEntity.bank, name: 'Santander'},
                    group: {...mockEntity.group, name: 'Mother'},
                }],
                type: 'bank'
            });
        });
    });

    describe('privates', () => {
        describe('getItemTitle', () => {
            it('should return the default when the type is undefined.', () => {
                const result = business['getItemTitle'](mockEntity, undefined);
                expect(result).toEqual(mockEntity.group.name);
            });

            it('should return the group name when the type is group.', () => {
                const result = business['getItemTitle'](mockEntity, 'group');
                expect(result).toEqual(mockEntity.group.name);
            });

            it('should return the bank name when the type is bank.', () => {
                const result = business['getItemTitle'](mockEntity, 'bank');
                expect(result).toEqual(mockEntity.bank.name);
            });

            it('should return the type when the type is type.', () => {
                const result = business['getItemTitle'](mockEntity, 'type');
                expect(result).toEqual(mockEntity.type.toLowerCase().replace(/ /g, '_'));
            });
        });
    });

});