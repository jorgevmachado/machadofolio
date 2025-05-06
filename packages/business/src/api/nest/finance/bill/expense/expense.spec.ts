import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { EMonth } from '@repo/services/date/month/enum';

import type { QueryParameters } from '../../../../../types';

import { NestModuleAbstract } from '../../../abstract';

import type { IExpenseCreateParams, IExpenseUpdateParams } from './types';
import { EExpenseType } from './enum';
import { Expense } from './expense';

jest.mock('../../../abstract');

describe('Expense', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    const mockEntity = {
            id: '41b0ef6f-0b6e-4633-94d9-14680010a0e2',
            name: 'Ingrid Residential Bank Slip Neoenergia',
            year: 2025,
            bill: {
                id: '4245135e-0e58-48fc-8fd2-9353d0f56c34',
                year: 2025,
                type: 'BANK_SLIP',
                name: 'Ingrid Residential Bank Slip',
                total: 4110,
                name_code: 'ingrid_residential_bank_slip',
                all_paid: false,
                total_paid: 2610,
                created_at: '2025-04-02T19:11:59.385Z',
                updated_at: '2025-04-02T19:11:59.385Z',
                deleted_at: null
            },
            type: EExpenseType.VARIABLE,
            paid: false,
            total: 654.26,
            supplier: {
                id: '5a724db5-532f-4622-97b0-5b7ddf5631dc',
                name: 'Neoenergia',
                name_code: 'neoenergia',
                created_at: '2025-04-02T19:11:59.334Z',
                updated_at: '2025-04-02T19:11:59.334Z',
                deleted_at: null
            },
            name_code: 'ingrid_residential_bank_slip_neoenergia',
            total_paid: 654.26,
            january: 284.69,
            january_paid: true,
            february: 369.57,
            february_paid: true,
            march: 0,
            march_paid: true,
            april: 0,
            april_paid: true,
            may: 0,
            may_paid: true,
            june: 0,
            june_paid: true,
            july: 0,
            july_paid: true,
            august: 0,
            august_paid: true,
            september: 0,
            september_paid: true,
            october: 0,
            october_paid: true,
            november: 0,
            november_paid: true,
            december: 0,
            december_paid: true,
            description: null,
            instalment_number: 1,
            created_at: '2025-02-01T17:37:47.783Z',
            updated_at: '2025-02-01T14:40:31.207Z',
            deleted_at: null
        };
    const mockPaginateParams: QueryParameters = { page: 1, limit: 10 };
    const mockEntityList = [mockEntity, mockEntity];
    const mockEntityPaginate = {
        skip: 0,
        next: 0,
        prev: 0,
        total: 0,
        pages: 0,
        results: mockEntityList,
        per_page: 0,
        current_page: 0,
    };

    let expense: Expense;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        expense = new Expense(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should initialize with the correct path and config', () => {
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'finance/bill',
                nestModuleConfig: mockConfig,
            });
        });
    });

    describe('getAllByBill', () => {
        it('should call get with correct URL and parameters for getAllByBill', async () => {
            const mockGetAllByBill = jest
                .spyOn(NestModuleAbstract.prototype, 'get')
                .mockResolvedValue(mockEntityPaginate);
            const result = await expense.getAllByBill(
                mockEntity.bill.id,
                mockPaginateParams,
            );

            expect(mockGetAllByBill).toHaveBeenCalledTimes(1);
            expect(mockGetAllByBill).toHaveBeenCalledWith(
                `finance/bill/${mockEntity.bill.id}/list/expense`,
                { params: mockPaginateParams },
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });

    describe('getOneByBill', () => {
        it('should call get with correct URL and parameters for getOneByBill', async () => {
            const mockGetOneByBill = jest
                .spyOn(NestModuleAbstract.prototype, 'get')
                .mockResolvedValue(mockEntity);
            const result = await expense.getOneByBill(
                mockEntity.bill.id,
                mockEntity.id,
            );

            expect(mockGetOneByBill).toHaveBeenCalledTimes(1);
            expect(mockGetOneByBill).toHaveBeenCalledWith(
                `finance/bill/${mockEntity.bill.id}/expense/${mockEntity.id}`,
            );
            expect(result).toEqual(mockEntity);
        });
    });

    describe('deleteByBill', () => {
        it('should call delete with correct URL and parameters for deleteByBill', async () => {
            const mockDeleteByBill = jest
                .spyOn(NestModuleAbstract.prototype, 'remove')
                .mockResolvedValue({ message: 'Successfully removed' });
            const result = await expense.deleteByBill(
                mockEntity.bill.id,
                mockEntity.id,
            );
            expect(mockDeleteByBill).toHaveBeenCalledTimes(1);
            expect(mockDeleteByBill).toHaveBeenCalledWith(
                `finance/bill/${mockEntity.bill.id}/expense/${mockEntity.id}`,
            );
            expect(result).toEqual({ message: 'Successfully removed' });
        });
    });

    describe('createByBill', () => {
        it('should call create with correct URL and parameters for createByBill', async () => {
            const mockCreateByBill = jest
                .spyOn(NestModuleAbstract.prototype, 'post')
                .mockResolvedValue(mockEntity);
            const mockExpenseCreateParams: IExpenseCreateParams = {
                type: mockEntity.type,
                paid: mockEntity.paid,
                value: 100,
                month: EMonth.MARCH,
                supplier: mockEntity.supplier.name,
                description: mockEntity.description,
                instalment_number: mockEntity.instalment_number,
            };
            const result = await expense.createByBill(mockEntity.bill.id, mockExpenseCreateParams);
            expect(mockCreateByBill).toHaveBeenCalledTimes(1);
            expect(mockCreateByBill).toHaveBeenCalledWith(
                `finance/bill/${mockEntity.bill.id}/expense`,
                { body: mockExpenseCreateParams }
            );
            expect(result).toEqual(mockEntity);
        });
    });

    describe('updateByBill', () => {
        it('should call update with correct URL and parameters for updateByBill', async () => {
            const mockCreateByBill = jest
                .spyOn(NestModuleAbstract.prototype, 'path')
                .mockResolvedValue(mockEntity);
            const mockExpenseUpdateParams: IExpenseUpdateParams = {
                ...mockEntity,
                bill: mockEntity.bill.id,
                type: mockEntity.type,
                supplier: mockEntity.supplier.id,
            };
            const result = await expense.updateByBill(mockEntity.bill.id, mockEntity.id, mockExpenseUpdateParams);
            expect(mockCreateByBill).toHaveBeenCalledTimes(1);
            expect(mockCreateByBill).toHaveBeenCalledWith(
                `finance/bill/${mockEntity.bill.id}/expense/${mockEntity.id}`,
                { body: mockExpenseUpdateParams }
            );
            expect(result).toEqual(mockEntity);
        });
    });
});