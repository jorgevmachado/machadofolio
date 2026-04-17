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
    const getListJsonParams = {
        staging: [{env: 'staging'}],
        production: [{env: 'production'}],
        development: [{env: 'development'}],
    };

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
            insert: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        } as unknown as jest.Mocked<Repository<MockEntity>>;
        mockValidate = {
            listMock: jest.fn(),
        } as unknown as jest.Mocked<Validate>;

        mockQueries = {
            list: jest.fn(),
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Queries<MockEntity>>;

        seeder = new Seeder('development','testEntity', ['relation1'], mockRepository)
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

    describe('currentSeeds', () => {
        it('Should return a empty seeds when seedsJson and seeds is undefined in params.', () => {
            const result = seeder.currentSeeds({});
            expect(result).toEqual([]);
        });

        it('Should return seeds when seedsJson is undefined in params.', () => {
            const result = seeder.currentSeeds({ seeds: [mockEntity1] });
            expect(result).toEqual([mockEntity1]);
        });

        it('Should return seeds when seedsJson is defined in params.', () => {
            const result = seeder.currentSeeds({ seedsJson: [mockEntity2] });
            expect(result).toEqual([mockEntity2]);
        });
    });

    describe('getListJson', () => {
        it('should return a list json of development with default env', () => {
            const result = seeder.getListJson(getListJsonParams);
            expect(result).toEqual(getListJsonParams.development);
        });

        it('should return a list json of development', () => {
            const result = seeder.getListJson({
                ...getListJsonParams,
                env: 'development',
            });
            expect(result).toEqual(getListJsonParams.development);
        });

        it('should return a list json of staging', () => {
            const result = seeder.getListJson({
                ...getListJsonParams,
                env: 'staging',
            });
            expect(result).toEqual(getListJsonParams.staging);
        });

        it('should return a list json of production', () => {
            const result = seeder.getListJson({
                ...getListJsonParams,
                env: 'production',
            });
            expect(result).toEqual(getListJsonParams.production);
        });

    });

    describe('persistEntity', () => {
        it('should return empty when received boolean flag withSeed equal false', async () => {
            const result = await seeder.persistEntity({...getListJsonParams, withSeed: false});
            expect(result).toEqual({ list: [], added: []});
        });

        it('should persist entity seeds', async () => {
            mockQueries.list.mockResolvedValueOnce([]);
            jest.spyOn(seeder, 'getListJson').mockReturnValue([mockEntity1]);
            mockQueries.findOne.mockResolvedValueOnce(null);

            // @ts-ignore
            jest.spyOn(mockRepository, 'insert').mockResolvedValueOnce(mockEntity1);
            const result = await seeder.persistEntity({
                ...getListJsonParams,
                withSeed: true,
                withRelations: true,
            });
            expect(result).toEqual({ list: [mockEntity1], added: [mockEntity1]});
        });

        it('should persist entity seeds with persistEntityFn', async () => {
            mockQueries.list.mockResolvedValueOnce([]);
            jest.spyOn(seeder, 'getListJson').mockReturnValue([mockEntity1]);
            mockQueries.findOne.mockResolvedValueOnce(null);
            // @ts-ignore
            jest.spyOn(mockRepository, 'insert').mockResolvedValueOnce(mockEntity1);
            const result = await seeder.persistEntity({
                ...getListJsonParams,
                withSeed: true,
                withRelations: true,
                persistEntityFn: (json) => json,
            });
            expect(result).toEqual({ list: [mockEntity1], added: [mockEntity1]});
        });
    });

    describe('generateEntity', () => {
        it('should return empty when received boolean flag withSeed equal false', async () => {
            const result = await seeder.generateEntity({
                ...getListJsonParams,
                seedsDir: 'dir',
                withSeed: false,
                filterGenerateEntityFn: () => true,
            });
            expect(result).toEqual({ list: [], added: []});
        });

        it('should added empty when dont generate seeds', async () => {
            mockQueries.list.mockResolvedValueOnce([]);
            jest.spyOn(seeder, 'getListJson').mockReturnValue([mockEntity1]);

            const result = await seeder.generateEntity({
                ...getListJsonParams,
                seedsDir: 'dir',
                withSeed: true,
                filterGenerateEntityFn: () => false,
            });
            expect(result).toEqual({ list: [mockEntity1], added: []});
        });

        it('should generate seeds', async () => {
            mockQueries.list.mockResolvedValueOnce([mockEntity1]);
            jest.spyOn(seeder, 'getListJson').mockReturnValue([mockEntity1]);

            const result = await seeder.generateEntity({
                ...getListJsonParams,
                seedsDir: 'dir',
                withSeed: true,
                filterGenerateEntityFn: () => false,
            });
            expect(result).toEqual({ list: [mockEntity1, mockEntity1], added: [mockEntity1]});
        });
    });
});