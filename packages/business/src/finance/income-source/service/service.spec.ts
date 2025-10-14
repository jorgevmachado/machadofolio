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

import { INCOME_SOURCE_MOCK  } from '../../mock';

jest.mock('../income-source', () => ({
    __esModule: true,
    default: function IncomeSource(response) {
        Object.assign(this, INCOME_SOURCE_MOCK, response);
    },
    IncomeSource: function IncomeSource(response) {
        Object.assign(this, INCOME_SOURCE_MOCK, response);
    },
}));

import { IncomeSourceService } from './service';

describe('IncomeSourceService function', () => {
    let service: IncomeSourceService;
    let mockNest: jest.Mocked<Nest>;
    const mockEntity = INCOME_SOURCE_MOCK;
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
                    source: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new IncomeSourceService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('create', () => {
        it('should successfully create an income source', async () => {
            mockNest.finance.income.source.create.mockResolvedValue(mockEntity);

            const result = await service.create({ name: mockEntity.name });

            expect(mockNest.finance.income.source.create).toHaveBeenCalledWith({
                name: mockEntity.name,
            });
            expect(result).toEqual(mockEntity);
        });
    });

    describe('update', () => {
        it('should successfully update an income source', async () => {
            mockNest.finance.income.source.update.mockResolvedValue(mockEntity);

            const result = await service.update(mockEntity.id, {
                name: mockEntity.name,
            });

            expect(mockNest.finance.income.source.update).toHaveBeenCalledWith(
                mockEntity.id,
                { name: mockEntity.name },
            );
            expect(result).toEqual(mockEntity);
        });

        it('should throw an error if the update fails', async () => {
            const mockError = new Error('Failed to update income source');
            mockNest.finance.income.source.update.mockRejectedValue(mockError);

            await expect(
                service.update(mockEntity.id, { name: mockEntity.name }),
            ).rejects.toThrow('Failed to update income source');
        });

        it('should call the update method with correct arguments', async () => {
            mockNest.finance.income.source.update.mockResolvedValue(mockEntity);

            await service.update(mockEntity.id, { name: mockEntity.name });

            expect(mockNest.finance.income.source.update).toHaveBeenCalledWith(
                mockEntity.id,
                { name: mockEntity.name}
            );
            expect(mockNest.finance.income.source.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        it('should successfully delete an income source', async () => {
            const mockResponse = { message: 'Successfully removed' };
            mockNest.finance.income.source.delete.mockResolvedValue(mockResponse);
            const result = await service.remove(mockEntity.id);

            expect(mockNest.finance.income.source.delete).toHaveBeenCalledWith(
                mockEntity.id
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should successfully get an income source', async () => {
            mockNest.finance.income.source.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.finance.income.source.getOne).toHaveBeenCalledWith(
                mockEntity.id
            );
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll income source list', async () => {
            mockNest.finance.income.source.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.finance.income.source.getAll).toHaveBeenCalledWith({});
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll income source list paginate', async () => {
            mockNest.finance.income.source.getAll.mockResolvedValue(
                mockEntityPaginate,
            );
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.finance.income.source.getAll).toHaveBeenCalledWith(
                mockPaginateParams
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});