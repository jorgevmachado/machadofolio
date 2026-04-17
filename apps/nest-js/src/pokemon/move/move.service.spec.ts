import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn();
        seeder = {
            entities: jest.fn(),
        };
        queries ={
            findOneByOrder: jest.fn(),
        };
        findOne = jest.fn();
    }
    return { Service: ServiceMock }
});

import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PokeApiService } from '@repo/business';

import { POKEMON_MOVE_MOCK } from '../mocks/move.mock';
import { PokemonMove } from '../entities/move.entity';

import { PokemonMoveService } from './move.service';


describe('MoveService', () => {
    let service: PokemonMoveService;
    let repository: Repository<PokemonMove>;
    let pokeApiService: PokeApiService;
    const mockEntity: PokemonMove = POKEMON_MOVE_MOCK;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonMoveService,
                { provide: getRepositoryToken(PokemonMove), useClass: Repository },
                {
                    provide: PokeApiService, useValue: { move: { getOne: jest.fn() }}
                }
            ],
        }).compile();

        service = module.get<PokemonMoveService>(PokemonMoveService);
        repository = module.get<Repository<PokemonMove>>(getRepositoryToken(PokemonMove));
        pokeApiService = module.get<PokeApiService>(PokeApiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
        expect(pokeApiService).toBeDefined();
    });

    describe('findList', () => {
        it('Should return undefined when dont received list', async () => {
            const result = await service.findList();
            expect(result).toBeUndefined();
        });

        it('Should return an list of moves from the database', async () => {
            jest.spyOn(service.queries, 'findOneByOrder').mockImplementation( async () => mockEntity);

            const result = await service.findList([mockEntity]);
            expect(result).toEqual([mockEntity]);
        });

        it('must save a list of pokemon moves in the database when none exist', async () => {
            jest.spyOn(service, 'completingData' as any).mockResolvedValueOnce(mockEntity);

            jest.spyOn(service.queries, 'findOneByOrder').mockImplementation( async ({ response, completingData }: any) => {
                completingData(mockEntity, response);
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

    describe('completingData', () => {
        it('should return entity when exist in database', async () => {
            expect(await service['completingData'](mockEntity, mockEntity)).toEqual(mockEntity);
        });

        it('should save entity when not exist in database', async () => {
            jest.spyOn(pokeApiService.move, 'getOne').mockResolvedValueOnce(mockEntity);
            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
            jest.spyOn(service.queries, 'findOneByOrder').mockResolvedValueOnce(mockEntity);
            expect(await service['completingData'](mockEntity)).toEqual(mockEntity);
        });

        it('should throw erro when service failed', async () => {
            jest.spyOn(pokeApiService.move, 'getOne').mockImplementation(() => { throw new InternalServerErrorException() });
            jest.spyOn(service, 'error').mockImplementation(() => { throw new InternalServerErrorException() });
            await expect(service['completingData'](mockEntity)).rejects.toThrowError(InternalServerErrorException);
        });
    });
});