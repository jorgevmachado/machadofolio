import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { type Repository } from 'typeorm';

import { ConflictException } from '@nestjs/common';

import * as Services from '@repo/services';

import { File } from '../file';
import { Queries } from '../queries';
import { Seeder } from '../seeder';
import { Validate } from '../validate';


import { Service } from './service';

const errorMock = jest.fn();

jest.mock('../base', () => {
    class BaseMock {
        error = errorMock;
    }
    return { Base: BaseMock };
});
jest.mock('../file');
jest.mock('../queries');
jest.mock('../seeder');
jest.mock('../validate');

type MockEntity = {
    id: string;
    name: string;
}

const mockRepository = {
    save: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    softRemove: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    insert: jest.fn(),
    manager: {
        transaction: jest.fn(),
    },
} as unknown as Repository<MockEntity>;

jest.mock('typeorm', () => {
    return {
        Repository: jest.fn().mockImplementation(() => mockRepository),
    };
});

class TestService extends Service<MockEntity> {
    constructor() {
        super('mockAlias', ['relation1', 'relation2'], mockRepository);
    }
}

describe('service', () => {
    const entity = {
        id: '52422c37-83a7-4ca6-96c4-bd15a1dc61bc',
        name: 'test',
    };
    const entities = [
        entity,
        {
            id: '92ca29f3-d08d-4abe-a157-94ef70f512c7',
            name: 'test2',
        },
    ];
    const getListJsonParams = {
        staging: [{env: 'staging'}],
        production: [{env: 'production'}],
        development: [{env: 'development'}],
    };

    let service: TestService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new TestService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
            expect(service.file).toBeDefined();
            expect(service.seeder).toBeDefined();
            expect(service.validate).toBeDefined();
            expect(service.queries).toBeDefined();
        });
    });

    describe('fileModule', () => {
        it('should initialize fileModule module.', () => {
            expect(File).toBeCalledTimes(1);
        });
    });

    describe('seederModule', () => {
        it('should initialize seederModule module.', () => {
            expect(Seeder).toBeCalledTimes(1);
            expect(Seeder).toBeCalledWith(
                'mockAlias',
                ['relation1', 'relation2'],
                mockRepository,
            );
        });

    });

    describe('queriesModule', () => {
        it('should initialize queriesModule module.', () => {
            expect(Queries).toBeCalledTimes(1);
            expect(Queries).toBeCalledWith(
                'mockAlias',
                ['relation1', 'relation2'],
                mockRepository,
            );
        });
    });

    describe('validateModule', () => {
        it('should initialize validate module.', () => {
            expect(Validate).toBeCalledTimes(1);
        });
    });

    describe('save', () => {
        it('should save entity successfully', async () => {
            jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(entity);

            const result = await service.save(entity);

            expect(mockRepository.save).toBeCalledTimes(1);
            expect(mockRepository.save).toBeCalledWith(entity);
            expect(result).toEqual(entity);
        });

        it('should save entity successfully with id equal ""', async () => {
            jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(entity);

            const result = await service.save({...entity, id: ''});

            expect(mockRepository.save).toBeCalledTimes(1);
            expect(mockRepository.save).toBeCalledWith({...entity, id: undefined });
            expect(result).toEqual(entity);
        });

        it('should return conflict Exception when try to save.', async () => {
            jest.spyOn(mockRepository, 'save').mockRejectedValueOnce(new ConflictException());

            errorMock.mockImplementationOnce(() => { throw new ConflictException(); });

            await expect(service.save(entity)).rejects.toThrow(ConflictException);

            expect(errorMock).toBeCalled();
        });
    });

    describe('softRemove', () => {
        it('should softRemove entity successfully', async () => {
            jest.spyOn(mockRepository, 'softRemove').mockResolvedValueOnce(entity);

            const result = await service.softRemove(entity);

            expect(mockRepository.softRemove).toBeCalledTimes(1);
            expect(mockRepository.softRemove).toBeCalledWith(entity);
            expect(result).toEqual(entity);
        });

        it('should return conflict Exception when try to execute soft remove.', async () => {
            jest.spyOn(mockRepository, 'softRemove').mockRejectedValueOnce(new ConflictException());

            errorMock.mockImplementationOnce(() => { throw new ConflictException(); });

            await expect(service.softRemove(entity)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return an list of entities', async () => {
            jest.spyOn(Queries.prototype, 'list').mockResolvedValueOnce(entities);
            const result = await service.findAll({});
            expect(result).toEqual(entities);
        });
    });

    describe('findOne', () => {
        it('should return one entity', async () => {
            jest.spyOn(Queries.prototype, 'findOne').mockResolvedValueOnce(entity);
            const result = await service.findOne({ value: entity.id });
            expect(result).toEqual(entity);
        });
    });

    describe('remove', () => {
        it('should return one entity', async () => {
            jest.spyOn(Queries.prototype, 'findOne').mockResolvedValueOnce(entity);
            jest.spyOn(mockRepository, 'softRemove').mockResolvedValueOnce(entity);
            const result = await service.remove(entity.id);
            expect(result).toEqual({ message: 'Successfully removed' });
        });
    });

    describe('treatEntityParam', () => {
        it('should return one entity by request', async () => {
            jest.spyOn(Queries.prototype, 'findOne').mockResolvedValueOnce(entity);
            const result = await service.treatEntityParam(entity.id, 'Entity');
            expect(result).toEqual(entity);
        });

        it('should return one entity by list and name', async () => {
            const result = await service.treatEntityParam(
                entity.name,
                'Entity',
                entities,
            );
            expect(result).toEqual(entity);
        });

        it('should return one entity when the parameter is a entity', async () => {
            jest.spyOn(Validate.prototype, 'paramIsEntity').mockReturnThis();
            const result = await service.treatEntityParam(entity, 'Entity');
            expect(result).toEqual(entity);
        });
    });

    describe('treatEntitiesParams', () => {
        it('should return an list of entities empty', async () => {
            const result = await service.treatEntitiesParams();
            expect(result).toEqual([]);
        });

        it('should return an list of entities empty with list of entities empty', async () => {
            const result = await service.treatEntitiesParams([]);
            expect(result).toEqual([]);
        });
        
        it('should return an list of entities by request', async () => {
            jest.spyOn(Queries.prototype, 'list').mockResolvedValueOnce(entities);
            entities.forEach((entity) => {
                jest.spyOn(Queries.prototype, 'findOne').mockResolvedValueOnce(entity);
            })
            const result = await service.treatEntitiesParams(entities, 'Entity');
            expect(result).toEqual(entities);
        });
    });

    describe('findOneByList', () => {
        it('should return one entity by list and name', () => {
            (Services.isUUID as jest.Mock).mockReturnValueOnce(false);
            const result = service.findOneByList(entity.name, entities);
            expect(result).toEqual(entity);
        });

        it('should return one entity by list and uuid', () => {
            (Services.isUUID as jest.Mock).mockReturnValueOnce(true);
            const result = service.findOneByList(entity.id, entities);
            expect(result).toEqual(entity);
        });
    });

    describe('getListJson', () => {
        it('should return a list json of development with default env', () => {
            const result = service.getListJson(getListJsonParams);
            expect(result).toEqual(getListJsonParams.development);
        });

        it('should return a list json of development', () => {
            const result = service.getListJson({
                ...getListJsonParams,
                env: 'development',
            });
            expect(result).toEqual(getListJsonParams.development);
        });

        it('should return a list json of staging', () => {
            const result = service.getListJson({
                ...getListJsonParams,
                env: 'staging',
            });
            expect(result).toEqual(getListJsonParams.staging);
        });

        it('should return a list json of production', () => {
            const result = service.getListJson({
                ...getListJsonParams,
                env: 'production',
            });
            expect(result).toEqual(getListJsonParams.production);
        });

    });

    describe('persistEntitySeeds', () => {
        it('should return empty when received boolean flag withSeed equal false', async () => {
            const result = await service.persistEntitySeeds({...getListJsonParams, withSeed: false});
            expect(result).toEqual({ list: [], added: []});
        });

        it('should persist entity seeds', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
            jest.spyOn(service, 'getListJson').mockReturnValue([entity]);
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            // @ts-ignore
            jest.spyOn(mockRepository, 'insert').mockResolvedValueOnce(entity);
            const result = await service.persistEntitySeeds({
                ...getListJsonParams,
                withSeed: true,
                withRelations: true,
            });
            expect(result).toEqual({ list: [entity], added: [entity]});
        });

        it('should persist entity seeds with persistEntitySeedsFn', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
            jest.spyOn(service, 'getListJson').mockReturnValue([entity]);
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            // @ts-ignore
            jest.spyOn(mockRepository, 'insert').mockResolvedValueOnce(entity);
            const result = await service.persistEntitySeeds({
                ...getListJsonParams,
                withSeed: true,
                withRelations: true,
                persistEntitySeedsFn: (json) => json,
            });
            expect(result).toEqual({ list: [entity], added: [entity]});
        });
    });

    describe('generateEntitySeeds', () => {
        it('should return empty when received boolean flag withSeed equal false', async () => {
            const result = await service.generateEntitySeeds({
                ...getListJsonParams,
                seedsDir: 'dir',
                withSeed: false,
                filterGenerateEntitySeedsFn: () => true,
            });
            expect(result).toEqual({ list: [], added: []});
        });

        it('should added empty when dont generate seeds', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
            jest.spyOn(service, 'getListJson').mockReturnValue([entity]);

            const result = await service.generateEntitySeeds({
                ...getListJsonParams,
                seedsDir: 'dir',
                withSeed: true,
                filterGenerateEntitySeedsFn: () => false,
            });
            expect(result).toEqual({ list: [entity], added: []});
        });

        it('should generate seeds', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValueOnce([entity]);
            jest.spyOn(service, 'getListJson').mockReturnValue([entity]);

            const result = await service.generateEntitySeeds({
                ...getListJsonParams,
                seedsDir: 'dir',
                withSeed: true,
                filterGenerateEntitySeedsFn: () => false,
            });
            expect(result).toEqual({ list: [entity, entity], added: [entity]});
        });


    });
});