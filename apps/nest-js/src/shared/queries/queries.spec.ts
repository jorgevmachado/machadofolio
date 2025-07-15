import { NotFoundException } from '@nestjs/common';
import { type Repository } from 'typeorm';

import * as Services from '@repo/services';

import { Paginate } from '@repo/business';

import { type FindByParams } from './types';
import { Queries } from './queries';

jest.mock('@repo/business');
jest.mock('@repo/services', () => ({
    ...jest.requireActual('@repo/services'),
    isUUID: jest.fn(),
}));

type TestEntity = {
    id: string;
    name: string;
    order: number;
}

describe('Queries', () => {
    let queries: Queries<TestEntity>;
    let repository: jest.Mocked<Repository<TestEntity>>;

    const mockEntity: TestEntity = { id: '1', name: 'Test', order: 1 };

    const mockQueryBuilder: any = {
        skip: jest.fn(),
        take: jest.fn(),
        getMany: jest.fn(),
        getOne: jest.fn(),
        getManyAndCount: jest.fn(),
        andWhere: jest.fn().mockReturnThis(),
    };


    beforeEach(() => {
        repository = {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        } as unknown as jest.Mocked<Repository<TestEntity>>;

        queries = new Queries<TestEntity>('testEntity', ['relation1', 'relation2'], repository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should return paginated results if page and limit are provided', async () => {
            const params = {
                parameters: { page: 1, limit: 2 },
                filters: [],
            };
            mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[mockEntity], 1]);
            mockQueryBuilder.skip.mockReturnThis(0);
            mockQueryBuilder.take.mockReturnThis(2);

            const result = await queries.list(params);

            expect(result).toBeInstanceOf(Paginate);
            expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
            expect(mockQueryBuilder.take).toHaveBeenCalledWith(2);
            expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
        });

        it('should return all results if page and limit are not provided', async () => {
            const params = { filters: [] };

            mockQueryBuilder.getMany.mockResolvedValueOnce([mockEntity]);

            const result = await queries.list(params);

            expect(result).toEqual([mockEntity]);
            expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('findBy', () => {
        it('should return the result if it is found', async () => {
            const params: FindByParams = {
                filters: [],
                relations: ['relation1'],
                searchParams: {
                    by: 'name',
                    value: 'test',
                    condition: '=',
                }
            };
            mockQueryBuilder.getOne.mockResolvedValueOnce(mockEntity);

            const result = await queries.findBy(params);

            expect(result).toEqual(mockEntity);
            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });

        it('should throw NotFoundException if result is not found and withThrow is true', async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(null);
            const notFoundParams: FindByParams = {
                filters: [],
                relations: ['relation1'],
                withThrow: true,
                searchParams: {
                    by: 'name',
                    value: 'test',
                    condition: '=',
                }
            };
            await expect(
                queries.findBy(notFoundParams),
            ).rejects.toThrow(NotFoundException);

            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('should search by id if value is a valid UUID', async () => {
            const uuid = '550e8400-e29b-41d4-a716-446655440000';
            (Services.isUUID as jest.Mock).mockReturnValueOnce(true);

            mockQueryBuilder.getOne.mockResolvedValueOnce(mockEntity);

            const result = await queries.findOne({ value: uuid });

            expect(result).toEqual(mockEntity);
            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });

        it('should search by name if value is not a valid UUID', async () => {
            const name = 'Test Name';
            (Services.isUUID as jest.Mock).mockReturnValueOnce(false);

            mockQueryBuilder.getOne.mockResolvedValueOnce(mockEntity);

            const result = await queries.findOne({ value: name });

            expect(result).toEqual(mockEntity);
            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });

        it('should throw NotFoundException if withThrow is true and no result is found', async () => {
            (Services.isUUID as jest.Mock).mockReturnValueOnce(false);

            mockQueryBuilder.getOne.mockResolvedValueOnce(null);


            await expect(
                queries.findOne({ value: 'nonexistent', withThrow: true }),
            ).rejects.toThrow(NotFoundException);

            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOneByOrder', () => {
        it('should return result as is if complete is false', async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(mockEntity);

            const result = await queries.findOneByOrder({
                order: 1,
                complete: false,
            });

            expect(result).toEqual(mockEntity);
            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });

        it('should complete the result if `completingData` is provided and `complete` is true', async () => {
            const completingData = jest.fn(async (entity: TestEntity) => {
                return {
                    ...entity,
                    completed: true,
                };
            });


            mockQueryBuilder.getOne.mockResolvedValueOnce(mockEntity);

            const result = await queries.findOneByOrder({
                order: 1,
                complete: true,
                completingData,
                response: {},
            });

            expect(result).toEqual({
                ...mockEntity,
                completed: true,
            });
            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
            expect(completingData).toHaveBeenCalledTimes(1);
        });

        it('should throw NotFoundException if no result is found and withThrow is true', async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(null);

            await expect(
                queries.findOneByOrder({ order: 1, withThrow: true }),
            ).rejects.toThrow(NotFoundException);

            expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
        });
    });
});