import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';

import { type Repository } from 'typeorm';

import { type Queries } from '../queries';
import { Seeder } from './seeder';
import { type Validate } from '../validate';

type MockEntity = {
    id: string;
    name?: string;
}

describe('Seeder', () => {
    let seeder: Seeder<MockEntity>
    let mockRepository: jest.Mocked<Repository<MockEntity>>;
    let mockValidate: jest.Mocked<Validate>;
    let mockQueries: jest.Mocked<Queries<MockEntity>>;

    const createdEntityFn = jest.fn(async (entity: MockEntity) => entity);

    const label = 'Test Entity';
    const mockEntity1: MockEntity = { id: '1', name: 'Entity Seed 1' };
    const mockEntity2: MockEntity = { id: '2', name: 'Entity Seed 2' };
    const mockEntity3: MockEntity = { id: '3', name: 'Entity Seed 3' };
    const messageResult = { message: `Seeding ${label} Completed Successfully!` };

    const mockEntities: Array<MockEntity> = [
        mockEntity1,
        mockEntity2,
    ];

    const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getOne: jest.fn(),
        find: jest.fn(),
        getManyAndCount: jest.fn(),
        andWhere: jest.fn().mockReturnThis(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository = {
            find: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        } as unknown as jest.Mocked<Repository<MockEntity>>;
        mockValidate = {
            listMock: jest.fn(),
        } as unknown as jest.Mocked<Validate>;

        mockQueries = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Queries<MockEntity>>;

        seeder = new Seeder('testEntity', ['relation1'], mockRepository)
        Object.defineProperty(seeder, 'validate', { value: mockValidate });
        Object.defineProperty(seeder, 'queries', { value: mockQueries });

    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should be defined', () => {
            expect(seeder).toBeDefined();
        });
    });

    describe('entity', () => {
        it('should return the entity if it already exists.', async () => {
            mockQueries.findOne.mockResolvedValueOnce(mockEntity1);

            const result = await seeder.entity({
                by: 'id',
                seed: mockEntity1,
                withReturnSeed: true,
                label,
                createdEntityFn,
            });

            expect(result).toEqual(mockEntity1);

        });

        it('should return message if it already exists.', async () => {
            mockQueries.findOne.mockResolvedValueOnce(mockEntity1);

            const result = await seeder.entity({
                by: 'id',
                seed: mockEntity1,
                withReturnSeed: false,
                label,
                createdEntityFn,
            });

            expect(result).toEqual(messageResult);

        });

        it('Should create and return a new entity if it does not exist.', async () => {
            mockQueries.findOne.mockResolvedValueOnce(null);

            const result = await seeder.entity({
                by: 'id',
                seed: mockEntity1,
                label,
                withReturnSeed: true,
                createdEntityFn: (entity: MockEntity) => Promise.resolve(entity),
            });

            expect(result).toEqual(mockEntity1);
        });

        it('Should create and return a message if it does not exist.', async () => {
            mockQueries.findOne.mockResolvedValueOnce(null);

            const result = await seeder.entity({
                by: 'id',
                seed: mockEntity1,
                label,
                withReturnSeed: false,
                createdEntityFn,
            });

            expect(result).toEqual(messageResult);
            expect(createdEntityFn).toHaveBeenCalledWith(mockEntity1);
        });

        it('Should create and return a message if it does not exist with name undefined.', async () => {
            mockQueries.findOne.mockResolvedValueOnce(null);
            const createdEntity = { id: '1' };
            const result = await seeder.entity({
                by: 'name',
                seed: createdEntity,
                label,
                withReturnSeed: false,
                createdEntityFn,
            });

            expect(result).toEqual(messageResult);
            expect(createdEntityFn).toHaveBeenCalledWith(createdEntity);
        });
    });

    describe('entities', () => {
        it('Should create and return a new entities if it does not exist.', async () => {
            const seeds = [
                ...mockEntities,
                mockEntity3
            ]
            mockRepository.find.mockResolvedValueOnce(mockEntities);
            mockRepository.save.mockResolvedValueOnce(mockEntity3);

            const result = await seeder.entities({
                by: 'id',
                key: 'id',
                label,
                seeds,
                createdEntityFn: async (entity) => entity,
            });

            expect(mockValidate.listMock).toHaveBeenCalledWith({
                key: 'id',
                list: seeds,
                label,
            });

            expect(result).toEqual(seeds);
        });

        it('Should create and return message if it does not exist.', async () => {
            const seeds = [
                ...mockEntities,
                mockEntity3
            ]
            mockRepository.find.mockResolvedValueOnce(mockEntities);
            mockRepository.save.mockResolvedValueOnce(mockEntity3);

            const result = await seeder.entities({
                by: 'id',
                key: 'id',
                label,
                seeds,
                withReturnSeed: false,
                createdEntityFn,
            });

            expect(mockValidate.listMock).toHaveBeenCalledWith({
                key: 'id',
                list: seeds,
                label,
            });

            expect(result).toEqual(messageResult);
        });

        it('Should return existing entities if no new ones are created.', async () => {
            mockRepository.find.mockResolvedValueOnce(mockEntities);

            const result = await seeder.entities({
                by: 'id',
                key: 'id',
                label,
                seeds: mockEntities,
                createdEntityFn,
            });

            expect(result).toEqual(mockEntities);
        });
    });

    describe('executeSeed', () => {
        it('deve executar o método de seeding e retornar itens válidos', async () => {
            const items = [undefined, ...mockEntities];

            const seedMethod = jest.fn(() => Promise.resolve(items));
            const result = await seeder.executeSeed({
                label,
                seedMethod,
            });

            expect(result).toEqual(mockEntities);
            expect(seedMethod).toHaveBeenCalled();
        });
    });

    describe('filterValidItems', () => {
        it('deve filtrar itens válidos', () => {
            const items = [undefined, ...mockEntities];
            const result = seeder.filterValidItems(items);

            expect(result).toEqual(mockEntities);
        });
    });

    describe('getRelation', () => {
        it('Should return the relation of entity.', () => {
            const result = seeder.getRelation({
                key: 'id',
                list: mockEntities,
                param: mockEntity1.id,
                relation: 'Relation'
            });
            expect(result).toEqual(mockEntity1);
        });
        it('Should Return Error when not exist relation of entity.', () => {

            expect(() => seeder.getRelation({
                key: 'name',
                list: mockEntities,
                param: 'not exist',
                relation: 'Relation'
            })).toThrow(ConflictException);
        });

    });


});