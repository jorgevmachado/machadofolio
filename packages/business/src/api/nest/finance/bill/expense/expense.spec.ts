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
                subPathUrl: 'expense',
                nestModuleConfig: mockConfig,
            });
        });
    });

    describe('getAll', () => {
        it('should call get with correct URL and parameters for getAll', async () => {

            const mockGetAll = jest
                .spyOn(NestModuleAbstract.prototype, 'getAll')
                .mockResolvedValue(mockEntityPaginate);

            const result = await expense.getAll(
                mockPaginateParams,
                mockEntity.bill.id,
            );

            expect(mockGetAll).toHaveBeenCalledTimes(1);
            expect(mockGetAll).toHaveBeenCalledWith(mockPaginateParams,mockEntity.bill.id);
            expect(result).toEqual(mockEntityPaginate);
        });
    });

    describe('getOne', () => {
        it('should call get with correct URL and parameters for getOne', async () => {
            const mockGetOne = jest
                .spyOn(NestModuleAbstract.prototype, 'getOne')
                .mockResolvedValue(mockEntity);
            const result = await expense.getOne(
                mockEntity.id,
                mockEntity.bill.id,
            );

            expect(mockGetOne).toHaveBeenCalledTimes(1);
            expect(mockGetOne).toHaveBeenCalledWith(mockEntity.id, mockEntity.bill.id);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('delete', () => {
        it('should call delete with correct URL and parameters for delete', async () => {
            const mockDelete = jest
                .spyOn(NestModuleAbstract.prototype, 'delete')
                .mockResolvedValue({ message: 'Successfully removed' });

            const result = await expense.delete(
                mockEntity.id,
                mockEntity.bill.id,
            );
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledWith(mockEntity.id,mockEntity.bill.id);
            expect(result).toEqual({ message: 'Successfully removed' });
        });
    });

    describe('create', () => {
        it('should call create with correct URL and parameters for create', async () => {
            const mockCreate = jest
                .spyOn(NestModuleAbstract.prototype, 'create')
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
            const result = await expense.create(mockExpenseCreateParams, mockEntity.bill.id);
            expect(mockCreate).toHaveBeenCalledTimes(1);
            expect(mockCreate).toHaveBeenCalledWith(mockExpenseCreateParams, mockEntity.bill.id);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('update', () => {
        it('should call update with correct URL and parameters for update', async () => {
            const mockUpdate = jest
                .spyOn(NestModuleAbstract.prototype, 'update')
                .mockResolvedValue(mockEntity);

            const mockExpenseUpdateParams: IExpenseUpdateParams = {
                ...mockEntity,
                bill: mockEntity.bill.id,
                type: mockEntity.type,
                supplier: mockEntity.supplier.id,
            };

            const result = await expense.update(mockEntity.id, mockExpenseUpdateParams, mockEntity.bill.id);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledWith(mockEntity.id, mockExpenseUpdateParams, mockEntity.bill.id);
            expect(result).toEqual(mockEntity);
        });
    });
});