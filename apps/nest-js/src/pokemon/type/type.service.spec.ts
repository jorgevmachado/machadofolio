jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        seeder = {
            entities: jest.fn(),
        };
        queries ={
            findOneByOrder: jest.fn(),
        };
    }
    return { Service: ServiceMock }
});

import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { POKEMON_TYPE_MOCK } from '../mocks/type';
import { PokemonType } from '../entities/type.entity';

import { PokemonTypeService } from './type.service';

describe('PokemonTypeService', () => {
    let service: PokemonTypeService;
    let repository: Repository<PokemonType>;
    const mockEntity: PokemonType = POKEMON_TYPE_MOCK;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonTypeService,
                { provide: getRepositoryToken(PokemonType), useClass: Repository },
            ],
        }).compile();

        service = module.get<PokemonTypeService>(PokemonTypeService);
        repository = module.get<Repository<PokemonType>>(getRepositoryToken(PokemonType));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('findList', () => {
        it('Should return undefined when dont received list', async () => {
            const result = await service.findList();
            expect(result).toBeUndefined();
        });

        it('Should return an list of moves from the database', async () => {
            jest.spyOn(service, 'completingData' as any).mockResolvedValueOnce(mockEntity);
            jest.spyOn(service.queries, 'findOneByOrder').mockImplementation( async ({ completingData }: any) => {
                completingData(mockEntity);
                return mockEntity;
            });

            const result = await service.findList([mockEntity]);
            expect(result).toEqual([mockEntity]);
        });
    });

    describe('seeds', () => {
        it('should seed the database when exist in database', async () => {
            jest.spyOn(service.seeder, 'entities').mockImplementation( async ( { createdEntityFn }: any) => {
                createdEntityFn(mockEntity);
                return [mockEntity];
            });

            expect(await service.seeds([mockEntity])).toEqual([mockEntity]);
        });
    });

    describe('privates', () => {
        describe('completingData', () => {
            it('should return entity when exist in database', async () => {
                expect(await service['completingData'](mockEntity, mockEntity)).toEqual(mockEntity);
            });

            it('should save entity when not exist in database', async () => {
                jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
                jest.spyOn(service.queries, 'findOneByOrder').mockResolvedValueOnce(mockEntity)
                expect(await service['completingData'](mockEntity)).toEqual(mockEntity);
            });
        });
    });
});