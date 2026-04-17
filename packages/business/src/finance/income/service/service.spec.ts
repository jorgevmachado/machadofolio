import { EMonth } from '@repo/services';

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

import { type Nest } from '../../../api';

import { INCOME_MOCK } from '../../mock';
import type { IncomeEntity } from '../types';

jest.mock('../income', () => ({
    __esModule: true,
    default: function Income(response) {
        Object.assign(this, INCOME_MOCK, response);
    },
    Income: function Income(response) {
        Object.assign(this, INCOME_MOCK, response);
    },
}));

import { IncomeService } from './service';

jest.mock('../../../api');

describe('Group Service', () => {
    let service: IncomeService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = INCOME_MOCK as unknown as IncomeEntity;
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
                income: {
                    getAll: jest.fn(),
                    getOne: jest.fn(),
                    create: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new IncomeService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('create', () => {
        it('should successfully create an group', async () => {
            mockNest.finance.income.create.mockResolvedValue(mockEntity);

            const result = await service.create({
                name: mockEntity.name,
                total: 100,
                month: EMonth.JANUARY,
                source: mockEntity.source,
            });

            expect(mockNest.finance.income.create).toHaveBeenCalledWith({
                name: mockEntity.name,
                total: 100,
                month: EMonth.JANUARY,
                source: mockEntity.source,
            });
            expect(result.id).toEqual(mockEntity.id);
            expect(result.name).toEqual(mockEntity.name);
            expect(result.total).toEqual(100);
            expect(result.name_code).toEqual(mockEntity.name_code);
            expect(result.finance.id).toEqual(mockEntity.finance.id);
            expect(result.months).toHaveLength(1);
        });
    });

    describe('update', () => {
        it('should successfully update an group', async () => {
            mockNest.finance.income.update.mockResolvedValue(mockEntity);

            const result = await service.update(mockEntity.id, {
                year: mockEntity.year,
                name: mockEntity.name,
                months: mockEntity.months,
                source: mockEntity.source,
            });

            expect(mockNest.finance.income.update).toHaveBeenCalledWith(
                mockEntity.id,
                {
                    year: mockEntity.year,
                    name: mockEntity.name,
                    months: mockEntity.months,
                    source: mockEntity.source,
                }
            );
            expect(result.id).toEqual(mockEntity.id);
            expect(result.year).toEqual(mockEntity.year);
            expect(result.name).toEqual(mockEntity.name);
            expect(result.total).toEqual(mockEntity.total);
            expect(result.name_code).toEqual(mockEntity.name_code);
            expect(result.finance.id).toEqual(mockEntity.finance.id);
            expect(result.months).toHaveLength(mockEntity.months.length);
        });

        it('should throw an error if the update fails', async () => {
            const mockError = new Error('Failed to update group');
            mockNest.finance.income.update.mockRejectedValue(mockError);

            await expect(
                service.update(mockEntity.id, {
                    name: mockEntity.name,
                    source: mockEntity.source,
                }),
            ).rejects.toThrow('Failed to update group');
        });

        it('should call the update method with correct arguments', async () => {
            mockNest.finance.income.update.mockResolvedValue(mockEntity);

            await service.update(mockEntity.id, {
                name: mockEntity.name,
                source: mockEntity.source,
            })

            expect(mockNest.finance.income.update).toHaveBeenCalledWith(
                mockEntity.id,
                {
                    name: mockEntity.name,
                    source: mockEntity.source,
                },
            );
            expect(mockNest.finance.income.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        it('should successfully delete an group', async () => {
            const mockResponse = { message: 'Successfully removed' };
            mockNest.finance.income.delete.mockResolvedValue(mockResponse);
            const result = await service.remove(mockEntity.id);

            expect(mockNest.finance.income.delete).toHaveBeenCalledWith(
                mockEntity.id
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should successfully get an group', async () => {
            mockNest.finance.income.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.finance.income.getOne).toHaveBeenCalledWith(
                mockEntity.id
            );
            expect(result.id).toEqual(mockEntity.id);
            expect(result.year).toEqual(mockEntity.year);
            expect(result.name).toEqual(mockEntity.name);
            expect(result.total).toEqual(mockEntity.total);
            expect(result.name_code).toEqual(mockEntity.name_code);
            expect(result.finance.id).toEqual(mockEntity.finance.id);
            expect(result.months).toEqual(mockEntity.months);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll group list', async () => {
            mockNest.finance.income.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.finance.income.getAll).toHaveBeenCalledWith({});
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll group list paginate', async () => {
            mockNest.finance.income.getAll.mockResolvedValue(
                mockEntityPaginate,
            );
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.finance.income.getAll).toHaveBeenCalledWith(
                mockPaginateParams
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});