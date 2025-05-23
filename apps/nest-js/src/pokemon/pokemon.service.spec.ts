import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EStatus } from '@repo/business/enum';
import { PokeApiService } from '@repo/business/pokemon/poke-api/service/service';

import { POKEMON_MOCK } from './mocks/pokemon';
import { Pokemon } from './entities/pokemon.entity';

import { POKEMON_ABILITY_MOCK } from './mocks/ability.mock';
import { POKEMON_MOVE_MOCK } from './mocks/move.mock';
import { POKEMON_TYPE_MOCK } from './mocks/type';
import type { PokemonAbility } from './entities/ability.entity';
import { PokemonAbilityService } from './ability/ability.service';
import type { PokemonMove } from './entities/move.entity';
import { PokemonMoveService } from './move/move.service';
import { PokemonService } from './pokemon.service';
import type { PokemonType } from './entities/type.entity';
import { PokemonTypeService } from './type/type.service';

describe('PokemonService', () => {
    const limit: number = 10;
    let service: PokemonService;
    let repository: Repository<Pokemon>;
    let pokeApiService: PokeApiService;
    let typeService: PokemonTypeService;
    let moveService: PokemonMoveService;
    let abilityService: PokemonAbilityService;
    const mockEntity: Pokemon = POKEMON_MOCK;
    const pokemonMoveMockEntity: PokemonMove = POKEMON_MOVE_MOCK;
    const pokemonTypeMockEntity: PokemonType = POKEMON_TYPE_MOCK;
    const pokemonAbilityMockEntity: PokemonAbility = POKEMON_ABILITY_MOCK;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokemonService,
                { provide: getRepositoryToken(Pokemon), useClass: Repository },
                {
                    provide: PokeApiService, useValue: {
                        limit,
                        getAll: jest.fn(),
                        getByName: jest.fn(),
                        getEvolutions: jest.fn(),
                    }
                },
                {
                    provide: PokemonTypeService,
                    useValue: {
                        findList: jest.fn(),
                    },
                },
                {
                    provide: PokemonMoveService,
                    useValue: {
                        findList: jest.fn(),
                    },
                },
                {
                    provide: PokemonAbilityService,
                    useValue: {
                        findList: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PokemonService>(PokemonService);
        repository = module.get<Repository<Pokemon>>(getRepositoryToken(Pokemon));
        pokeApiService = module.get<PokeApiService>(PokeApiService);
        abilityService = module.get<PokemonAbilityService>(PokemonAbilityService);
        moveService = module.get<PokemonMoveService>(PokemonMoveService);
        typeService = module.get<PokemonTypeService>(PokemonTypeService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
        expect(pokeApiService).toBeDefined();
        expect(abilityService).toBeDefined();
        expect(moveService).toBeDefined();
        expect(typeService).toBeDefined();
    });

    describe('findList', () => {
        it('Should return a list of pokemon from database ', async () => {
            jest.spyOn(repository, 'count').mockResolvedValueOnce(limit);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest
                    .fn()
                    .mockReturnValueOnce([mockEntity]),
            } as any);

            const result = await service.findAll({});
            expect(result).toEqual([mockEntity]);
        });

        it('Should return a list of pokemon from an external api since the database is empty', async () => {
            jest.spyOn(repository, 'count').mockResolvedValueOnce(0);

            jest.spyOn(pokeApiService, 'getAll').mockResolvedValueOnce([mockEntity]);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockEntity);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getMany: jest
                    .fn()
                    .mockReturnValueOnce([mockEntity]),
            } as any);

            const result = await service.findAll({});
            expect(result).toEqual([mockEntity]);
        });

        it('Should return error when the external api return an error', async () => {
            jest.spyOn(repository, 'count').mockResolvedValueOnce(0);

            jest.spyOn(pokeApiService, 'getAll').mockRejectedValueOnce(new Error('Internal Server Error'));

            const errorSpy = jest
                .spyOn(service as any, 'error')
                .mockImplementation((err) => {
                    throw err;
                });

            await expect(service.findAll({})).rejects.toThrow(
                'Internal Server Error',
            );
            expect(errorSpy).toHaveBeenCalledWith(new Error('Internal Server Error'));

        });
    });

    describe('findOne', () => {
        it('Should return a pokemon from database complete', async () => {
            const expectedEntity: Pokemon = {
                ...mockEntity,
                status: EStatus.COMPLETE,
            }
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce(mockEntity),
            } as any);

            const result = await service.findOne({ value: mockEntity.id });
            expect(result).toEqual(expectedEntity);
        });

        it('Should complete pokemon with external api when status is equal to incomplete', async () => {
            const expectedEntity: Pokemon = {
                ...mockEntity,
                status: EStatus.COMPLETE,
                moves: [pokemonMoveMockEntity],
                types: [pokemonTypeMockEntity],
                abilities: [pokemonAbilityMockEntity],
                evolutions: [mockEntity]
            }
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce({
                        ...mockEntity,
                        status: EStatus.INCOMPLETE,
                    }),
            } as any);

            jest.spyOn(pokeApiService, 'getByName').mockResolvedValueOnce(expectedEntity);

            jest.spyOn(moveService, 'findList').mockResolvedValueOnce([pokemonMoveMockEntity]);
            jest.spyOn(typeService, 'findList').mockResolvedValueOnce([pokemonTypeMockEntity]);
            jest.spyOn(abilityService, 'findList').mockResolvedValueOnce([pokemonAbilityMockEntity]);

            jest.spyOn(pokeApiService, 'getEvolutions').mockResolvedValueOnce([mockEntity.name]);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce({
                        ...mockEntity,
                        status: EStatus.INCOMPLETE,
                    }),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(expectedEntity);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce(expectedEntity),
            } as any);

            const result = await service.findOne({ value: mockEntity.id });
            expect(result.id).toEqual(expectedEntity.id);
        });

        it('Should return not found when do not find in database', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce(null),
            } as any);

            await expect(service.findOne({ value: mockEntity.id })).rejects.toThrow(
                'pokemons not found',
            );
        });

        it('Should complete pokemon with out evolutions', async () => {
            const expectedEntity: Pokemon = {
                ...mockEntity,
                status: EStatus.COMPLETE,
                moves: [pokemonMoveMockEntity],
                types: [pokemonTypeMockEntity],
                abilities: [pokemonAbilityMockEntity],
                evolutions: undefined
            }
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce({
                        ...mockEntity,
                        status: EStatus.INCOMPLETE,
                    }),
            } as any);

            jest.spyOn(pokeApiService, 'getByName').mockResolvedValueOnce({
                ...expectedEntity,
                evolution_chain_url: undefined,
            });

            jest.spyOn(moveService, 'findList').mockResolvedValueOnce([pokemonMoveMockEntity]);
            jest.spyOn(typeService, 'findList').mockResolvedValueOnce([pokemonTypeMockEntity]);
            jest.spyOn(abilityService, 'findList').mockResolvedValueOnce([pokemonAbilityMockEntity]);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(expectedEntity);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                orderBy: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                getOne: jest
                    .fn()
                    .mockReturnValueOnce(expectedEntity),
            } as any);

            const result = await service.findOne({ value: mockEntity.id });
            expect(result.id).toEqual(expectedEntity.id);
            expect(result.evolutions).toBeUndefined();
        });
    });
});
