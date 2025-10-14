jest.mock('../../../shared', () => ({
    BaseService: class {
        private repo: any;
        constructor(repo) {
            this.repo = repo;
        }
        create(...args) {
            return this.repo.create(...args);
        }
        update(...args) {
            return this.repo.update(...args);
        }
        delete(...args) {
            return this.repo.delete(...args);
        }
        remove(...args) {
            return this.repo.delete(...args);
        }
        get(...args) {
            return this.repo.getOne(...args);
        }
        getAll(...args) {
            return this.repo.getAll(...args);
        }
    },
}));

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { EMonth } from '@repo/services';

import { type Nest } from '../../../api';

import { EXPENSE_MOCK } from '../../mock';

jest.mock('../expense', () => ({
    __esModule: true,
    default: function Expense(response) {
        Object.assign(this, EXPENSE_MOCK, response);
    },
    Expense: function Expense(response) {
        Object.assign(this, EXPENSE_MOCK, response);
    },
}));



import type { CreateExpenseParams, ExpenseEntity, UpdateExpenseParams } from '../types';

import { ExpenseService } from './service';

jest.mock('../../../api');

describe('Expense Service', () => {
    let service: ExpenseService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = EXPENSE_MOCK as unknown as ExpenseEntity;

    const mockPaginateParams = { page: 1, limit: 10 };
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

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockNest = {
            finance: {
                bill: {
                    expense: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        getAllByBill: jest.fn(),
                    },
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new ExpenseService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should instantiate the service correctly', () => {
            expect(service).toBeInstanceOf(ExpenseService);
            expect(service['nest']).toBe(mockNest);
        });
    });

    describe('create', () => {
        it('should successfully create an supplier', async () => {
            mockNest.finance.bill.expense.create.mockResolvedValue(mockEntity);

            const mockExpenseCreateParams: CreateExpenseParams = {
                type: mockEntity.type,
                paid: mockEntity.paid,
                value: 100,
                month: EMonth.MARCH,
                supplier: mockEntity.supplier.name,
                description: mockEntity.description,
                instalment_number: mockEntity.instalment_number,
            };

            const result = await service.create(
                mockExpenseCreateParams,
                mockEntity.bill.id,
            );

            expect(mockNest.finance.bill.expense.create).toHaveBeenCalledWith(
                mockExpenseCreateParams,
                mockEntity.bill.id,
            );
            expect(result).toEqual(mockEntity);
        });
    });

    describe('update', () => {
        it('should successfully update an expense', async () => {
            mockNest.finance.bill.expense.update.mockResolvedValue(mockEntity);
            const mockExpenseUpdateParams: UpdateExpenseParams = {
                ...mockEntity,
            };

            const result = await service.update(
                mockEntity.id,
                mockExpenseUpdateParams,
                mockEntity.bill.id,
            );

            expect(mockNest.finance.bill.expense.update).toHaveBeenCalledWith(
                mockEntity.id,
                mockExpenseUpdateParams,
                mockEntity.bill.id,
            );
            expect(result).toEqual(mockEntity);
        });
    });

    describe('delete', () => {
        it('should successfully delete an expense', async () => {
            const mockResponse = { message: 'Successfully removed' };
            mockNest.finance.bill.expense.delete.mockResolvedValue(
                mockResponse,
            );
            const result = await service.remove(mockEntity.id, mockEntity.bill.id);

            expect(mockNest.finance.bill.expense.delete).toHaveBeenCalledWith(
                mockEntity.id,
                mockEntity.bill.id,
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should successfully get an expense', async () => {
            mockNest.finance.bill.expense.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id, mockEntity.bill.id);

            expect(mockNest.finance.bill.expense.getOne).toHaveBeenCalledWith(
                mockEntity.id,
                mockEntity.bill.id,
            );
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll expense list', async () => {
            mockNest.finance.bill.expense.getAll.mockResolvedValue(
                mockEntityList,
            );
            const result = await service.getAll({}, mockEntity.bill.id);

            expect(mockNest.finance.bill.expense.getAll).toHaveBeenCalledWith(
                {},
                mockEntity.bill.id,
            );
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll expense list paginate', async () => {
            mockNest.finance.bill.expense.getAll.mockResolvedValue(
                mockEntityPaginate,
            );
            const result = await service.getAll(
                mockPaginateParams,
                mockEntity.bill.id,
            );

            expect(mockNest.finance.bill.expense.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                mockEntity.bill.id,
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });

    describe('getAllByBill', () => {
        it('should successfully getAll expense list by bill id', async () => {
            mockNest.finance.bill.expense.getAllByBill.mockResolvedValue(
                mockEntityList,
            );
            const result = await service.getAllByBill(mockEntity.bill.id, {});

            expect(mockNest.finance.bill.expense.getAllByBill).toHaveBeenCalledWith(
                mockEntity.bill.id,
                {},
            );
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll expense list paginate by bill id', async () => {
            mockNest.finance.bill.expense.getAllByBill.mockResolvedValue(
                mockEntityPaginate,
            );
            const result = await service.getAllByBill(
                mockEntity.bill.id,
                mockPaginateParams,

            );

            expect(mockNest.finance.bill.expense.getAllByBill).toHaveBeenCalledWith(
                mockEntity.bill.id,
                mockPaginateParams,
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});