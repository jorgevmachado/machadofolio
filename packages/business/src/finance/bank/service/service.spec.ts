import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type Nest } from '../../../api';

import { BANK_MOCK } from '../../mock';

import { BankService } from './service';

jest.mock('../../../api');

describe('Bank Service', () => {
    let service: BankService;
    let mockNest: jest.Mocked<Nest>;

    const mockEntity = BANK_MOCK;
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
                bank: {
                    getAll: jest.fn(),
                    getOne: jest.fn(),
                    create: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                },
            },
        } as unknown as jest.Mocked<Nest>;

        service = new BankService(mockNest);
    });

    afterEach(() => {
        jest.resetModules();
    });
    
    describe('create', () => {
        it('should successfully create an bank', async () => {
            mockNest.finance.bank.create.mockResolvedValue(mockEntity);

            const result = await service.create({ name: mockEntity.name });

            expect(mockNest.finance.bank.create).toHaveBeenCalledWith({
                name: mockEntity.name,
            }, undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('update', () => {
        it('should successfully update an bank', async () => {
            mockNest.finance.bank.update.mockResolvedValue(mockEntity);

            const result = await service.update(mockEntity.id, {
                name: mockEntity.name,
            });

            expect(mockNest.finance.bank.update).toHaveBeenCalledWith(mockEntity.id, {
                name: mockEntity.name,
            }, undefined);
            expect(result).toEqual(mockEntity);
        });

        it('should throw an error if the update fails', async () => {
            const mockError = new Error('Failed to update bank');
            mockNest.finance.bank.update.mockRejectedValue(mockError);

            await expect(
                service.update(mockEntity.id, { name: mockEntity.name }),
            ).rejects.toThrow('Failed to update bank');
        });

        it('should call the update method with correct arguments', async () => {
            mockNest.finance.bank.update.mockResolvedValue(mockEntity);

            await service.update(mockEntity.id, { name: mockEntity.name });

            expect(mockNest.finance.bank.update).toHaveBeenCalledWith(mockEntity.id, {
                name: mockEntity.name,
            },undefined);
            expect(mockNest.finance.bank.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        it('should successfully delete an bank', async () => {
            const mockResponse = { message: 'Successfully removed' };
            mockNest.finance.bank.delete.mockResolvedValue(mockResponse);
            const result = await service.remove(mockEntity.id);

            expect(mockNest.finance.bank.delete).toHaveBeenCalledWith(mockEntity.id,undefined);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('get', () => {
        it('should successfully get an bank', async () => {
            mockNest.finance.bank.getOne.mockResolvedValue(mockEntity);
            const result = await service.get(mockEntity.id);

            expect(mockNest.finance.bank.getOne).toHaveBeenCalledWith(mockEntity.id,undefined);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('getAll', () => {
        it('should successfully getAll bank list', async () => {
            mockNest.finance.bank.getAll.mockResolvedValue(mockEntityList);
            const result = await service.getAll({});

            expect(mockNest.finance.bank.getAll).toHaveBeenCalledWith({},undefined);
            expect(result).toEqual(mockEntityList);
        });

        it('should successfully getAll bank list paginate', async () => {
            mockNest.finance.bank.getAll.mockResolvedValue(mockEntityPaginate);
            const result = await service.getAll(mockPaginateParams);

            expect(mockNest.finance.bank.getAll).toHaveBeenCalledWith(
                mockPaginateParams,
                undefined
            );
            expect(result).toEqual(mockEntityPaginate);
        });
    });
});