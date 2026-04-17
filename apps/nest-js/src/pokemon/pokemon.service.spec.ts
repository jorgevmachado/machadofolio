import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../shared', () => {
    class ServiceMock {
        save = jest.fn();
        error = jest.fn();
        file = {
            createDirectory: jest.fn(),
            getSeedsDirectory: jest.fn(),
        };
        seeder = {
            entities: jest.fn(),
            executeSeed: jest.fn(),
            currentSeeds: jest.fn(),
        };
        queries = {
            list: jest.fn(),
            findOne: jest.fn(),
            findOneByOrder: jest.fn(),
        };
    }
    return { Service: ServiceMock }
});
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EStatus, PokeApiService } from '@repo/business';

import { POKEMON_MOCK } from './mocks/pokemon';
import { Pokemon } from './entities/pokemon.entity';

import { POKEMON_ABILITY_MOCK } from './mocks/ability.mock';
import { POKEMON_MOVE_MOCK } from './mocks/move.mock';
import { POKEMON_TYPE_MOCK } from './mocks/type';
import type { PokemonAbility } from './entities/ability.entity';
import { PokemonAbilityService } from './ability/ability.service';
import type { PokemonMove } from './entities/move.entity';
import { PokemonMoveService } from './move/move.service';
import { PokemonGenerateSeeds, PokemonService } from './pokemon.service';
import type { PokemonType } from './entities/type.entity';
import { PokemonTypeService } from './type/type.service';
import type { CreatePokemonSeedsDto } from './dto/create-pokemon-seeds.dto';
import type { PokemonSeedsResult } from './types';

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

    const createPokemonSeedsDto:CreatePokemonSeedsDto = {
        move: true,
        type: true,
        ability: true,
        pokemon: true,
    };

    const pokemonGenerateSeeds: PokemonGenerateSeeds = {
        type: {
            list: [pokemonTypeMockEntity],
            added: [pokemonTypeMockEntity],
        },
        move: {
            list: [pokemonMoveMockEntity],
            added: [pokemonMoveMockEntity],
        },
        ability: {
            list: [pokemonAbilityMockEntity],
            added: [pokemonAbilityMockEntity],
        },
        pokemon: {
            list: [mockEntity],
            added: [mockEntity],
        },

    };

    const pokemonSeedsResult: PokemonSeedsResult = {
        move: { list: 1, added: 1 },
        type: { list: 1, added: 1 },
        ability: { list: 1, added: 1 },
        pokemon: { list: 1, added: 1 },
    };

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
                        seeds: jest.fn(),
                        findList: jest.fn(),
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn(),
                    },
                },
                {
                    provide: PokemonMoveService,
                    useValue: {
                        seeds: jest.fn(),
                        findList: jest.fn(),
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn(),
                    },
                },
                {
                    provide: PokemonAbilityService,
                    useValue: {
                        seeds: jest.fn(),
                        findList: jest.fn(),
                        persistSeeds: jest.fn(),
                        generateSeeds: jest.fn(),
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

    describe('findAll', () => {
        it('Should return a list of pokemon', async () => {
            jest.spyOn(service, 'validateDatabase' as any).mockResolvedValueOnce([mockEntity]);
            jest.spyOn(service.queries, 'list').mockResolvedValueOnce([mockEntity]);

            const result = await service.findAll({});
            expect(result).toEqual([mockEntity]);
        });
    });

    describe('findOne', () => {
        it('Should return a pokemon from database complete', async () => {
            jest.spyOn(service, 'validateEntity' as any).mockResolvedValueOnce(mockEntity);

            const result = await service.findOne({ value: mockEntity.id });
            expect(result).toEqual(mockEntity);
        });
    });

    describe('seeds', () => {
        const currentEntity = {
            ...mockEntity,
            moves: [pokemonMoveMockEntity],
            types: [pokemonTypeMockEntity],
            abilities: [pokemonAbilityMockEntity],
            evolutions: [mockEntity]
        }

        beforeEach(() => {
            jest.clearAllMocks();
            jest.restoreAllMocks();
        });

        afterEach(() => {
            jest.resetModules();
        });

        it('Should run all seeds and return list of seeds.', async () => {
            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonMoveMockEntity];
            });
            jest.spyOn(moveService, 'seeds').mockResolvedValueOnce([pokemonMoveMockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonTypeMockEntity];
            });
            jest.spyOn(typeService, 'seeds').mockResolvedValueOnce([pokemonTypeMockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonAbilityMockEntity];
            });
            jest.spyOn(abilityService, 'seeds').mockResolvedValueOnce([pokemonAbilityMockEntity]);

            jest.spyOn(service.seeder, 'entities').mockImplementation( async ({ createdEntityFn }: any) => {
                createdEntityFn(currentEntity);
                return [currentEntity];
            });

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([mockEntity]);

            jest.spyOn(service, 'save').mockResolvedValueOnce({ ...currentEntity, evolutions: undefined });

            const result = await service.seeds({
                users: [],
                listJson: [currentEntity],
                moveListJson: [pokemonMoveMockEntity],
                typeListJson: [pokemonTypeMockEntity],
                abilityListJson: [pokemonAbilityMockEntity],
            });

            expect(result.moves.length).toEqual(1);
            expect(result.types.length).toEqual(1);
            expect(result.abilities.length).toEqual(1);
            expect(result.pokemons.length).toEqual(1);
        });

        it('Should run all seeds and return list of seeds with has evolutions.', async () => {
            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonMoveMockEntity];
            });
            jest.spyOn(moveService, 'seeds').mockResolvedValueOnce([pokemonMoveMockEntity]);


            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonTypeMockEntity];
            });
            jest.spyOn(typeService, 'seeds').mockResolvedValueOnce([pokemonTypeMockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonAbilityMockEntity];
            });

            jest.spyOn(service.seeder, 'entities').mockImplementation( async () => [currentEntity]);

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([mockEntity]);

            const result = await service.seeds({
                users: [],
                listJson: [currentEntity],
                moveListJson: [pokemonMoveMockEntity],
                typeListJson: [pokemonTypeMockEntity],
                abilityListJson: [pokemonAbilityMockEntity],
            });

            expect(result.moves.length).toEqual(1);
            expect(result.types.length).toEqual(1);
            expect(result.abilities.length).toEqual(1);
            expect(result.pokemons.length).toEqual(1);
        });

        it('should run all seeds and return list of total seeds with some seeds empty', async () => {
            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [];
            });
            jest.spyOn(moveService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [];
            });
            jest.spyOn(typeService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [];
            });
            jest.spyOn(abilityService, 'seeds').mockResolvedValueOnce({ message: 'Successfully'});

            jest.spyOn(service.seeder, 'entities').mockImplementation( async () => [mockEntity]);

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([]);

            const result = await service.seeds({
                users: [],
                listJson: [mockEntity],
                moveListJson: [pokemonMoveMockEntity],
                typeListJson: [pokemonTypeMockEntity],
                abilityListJson: [pokemonAbilityMockEntity],
            });

            expect(result.moves.length).toEqual(0);
            expect(result.types.length).toEqual(0);
            expect(result.abilities.length).toEqual(0);
            expect(result.pokemons.length).toEqual(1);
        });

        it('should run all seeds and return list of seeds and not have in database evolutions.', async () => {
            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonMoveMockEntity];
            });
            jest.spyOn(moveService, 'seeds').mockResolvedValueOnce([pokemonMoveMockEntity]);


            jest.spyOn(service.seeder, 'executeSeed').mockImplementation(async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonTypeMockEntity];
            });
            jest.spyOn(typeService, 'seeds').mockResolvedValueOnce([pokemonTypeMockEntity]);

            jest.spyOn(service.seeder, 'executeSeed').mockImplementation( async ({ seedMethod }: any) => {
                seedMethod();
                return [pokemonAbilityMockEntity];
            });

            jest.spyOn(service.seeder, 'entities').mockImplementation( async () => [mockEntity]);

            jest.spyOn(service.seeder, 'currentSeeds').mockReturnValue([currentEntity]);

            jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);

            const result = await service.seeds({
                users: [],
                listJson: [currentEntity],
                moveListJson: [pokemonMoveMockEntity],
                typeListJson: [pokemonTypeMockEntity],
                abilityListJson: [pokemonAbilityMockEntity],
            });

            expect(result.moves.length).toEqual(1);
            expect(result.types.length).toEqual(1);
            expect(result.abilities.length).toEqual(1);
            expect(result.pokemons.length).toEqual(1);
        });
    });

    describe('generateSeeds', () => {
        it('should generate seeds successfully.', async () => {
            jest.spyOn(service, 'validatePokemonSeedsDto' as any).mockResolvedValueOnce(createPokemonSeedsDto);
            jest.spyOn(service.file, 'getSeedsDirectory').mockReturnValue('dir');
            jest.spyOn(service.file, 'createDirectory').mockReturnValue('dir/pokemon');
            jest.spyOn(moveService, 'generateSeeds').mockResolvedValueOnce(pokemonGenerateSeeds.move);
            jest.spyOn(typeService, 'generateSeeds').mockResolvedValueOnce(pokemonGenerateSeeds.type);
            jest.spyOn(abilityService, 'generateSeeds').mockResolvedValueOnce(pokemonGenerateSeeds.ability);
            jest.spyOn(service, 'generateSeed' as any).mockResolvedValueOnce(pokemonGenerateSeeds.pokemon);
            const result = await service.generateSeeds(createPokemonSeedsDto);
            expect(result.move).toEqual(pokemonSeedsResult.move);
            expect(result.type).toEqual(pokemonSeedsResult.type);
            expect(result.ability).toEqual(pokemonSeedsResult.ability);
            expect(result.pokemon).toEqual(pokemonSeedsResult.pokemon);
        })
    });

    describe('persistSeeds', () => {
        it('should persist seeds successfully.', async () => {
            jest.spyOn(service, 'validatePokemonSeedsDto' as any).mockResolvedValueOnce(createPokemonSeedsDto);

            jest.spyOn(moveService, 'persistSeeds').mockResolvedValueOnce(pokemonGenerateSeeds.move);
            jest.spyOn(typeService, 'persistSeeds').mockResolvedValueOnce(pokemonGenerateSeeds.type);
            jest.spyOn(abilityService, 'persistSeeds').mockResolvedValueOnce(pokemonGenerateSeeds.ability);
            jest.spyOn(service, 'persistSeed' as any).mockResolvedValueOnce(pokemonGenerateSeeds.pokemon);
            const result = await service.persistSeeds(createPokemonSeedsDto);
            expect(result.move).toEqual(pokemonSeedsResult.move);
            expect(result.type).toEqual(pokemonSeedsResult.type);
            expect(result.ability).toEqual(pokemonSeedsResult.ability);
            expect(result.pokemon).toEqual(pokemonSeedsResult.pokemon);
        })
    })

    describe('privates', () => {
        describe('createList', () => {
            it('Should create a list of pokemon', async () => {
                jest.spyOn(service, 'save').mockResolvedValueOnce(mockEntity);
                const result = await service['createList']([mockEntity]);
                expect(result).toEqual([mockEntity]);
            });

            it('should return error when try to save a list of pokemon', async () => {
                jest.spyOn(service, 'save').mockImplementation(() => { throw new InternalServerErrorException() });
                await expect(service['createList']([mockEntity])).rejects.toThrowError(InternalServerErrorException);

            });
        });

        describe('validateDatabase', () => {
            it('should return error when to try to request a poke api service', async () => {
                jest.spyOn(repository, 'count').mockResolvedValueOnce(0);
                jest.spyOn(service, 'error').mockImplementation(() => { throw new InternalServerErrorException() });
                jest.spyOn(pokeApiService, 'getAll').mockRejectedValueOnce(new Error('poke api fail'));
                await expect(service['validateDatabase']()).rejects.toThrowError(InternalServerErrorException);
            });
            it('should validate and save a list of pokemon in database when database is empty.', async () => {
                jest.spyOn(repository, 'count').mockResolvedValueOnce(0);
                jest.spyOn(pokeApiService, 'getAll').mockResolvedValueOnce([mockEntity]);
                jest.spyOn(service, 'createList' as any).mockResolvedValueOnce([mockEntity]);
                await service['validateDatabase']();
                expect(pokeApiService.getAll).toHaveBeenCalled();
            });

            it('should validate and save a list of pokemon in database when database is not empty.', async () => {
                jest.spyOn(repository, 'count').mockResolvedValueOnce(1);
                jest.spyOn(pokeApiService, 'getAll').mockResolvedValueOnce([mockEntity]);
                jest.spyOn(repository, 'find').mockResolvedValueOnce([{...mockEntity, name: 'pokemon'}]);
                jest.spyOn(service, 'createList' as any).mockResolvedValueOnce([mockEntity]);
                await service['validateDatabase']();
                expect(pokeApiService.getAll).toHaveBeenCalled();
                expect(service['createList']).toHaveBeenCalled();
            });

            it('should validate and save a list of pokemon in database when count is 1 and database is empty.', async () => {
                jest.spyOn(repository, 'count').mockResolvedValueOnce(1);
                jest.spyOn(pokeApiService, 'getAll').mockResolvedValueOnce([mockEntity]);
                jest.spyOn(repository, 'find').mockResolvedValueOnce(null as any);
                jest.spyOn(service, 'createList' as any).mockResolvedValueOnce([mockEntity]);
                await service['validateDatabase']();
                expect(pokeApiService.getAll).toHaveBeenCalled();
                expect(service['createList']).toHaveBeenCalled();
            });
        });

        describe('validateEntity', () => {
            it('should return a complete pokemon when has status complete in database.', async () => {
                jest.spyOn(service.queries, 'findOne').mockResolvedValueOnce(mockEntity);
                const result = await service['validateEntity']('pokemon');
                expect(result).toEqual(mockEntity);
            });

            it('should return a pokemon when has flag complete false.', async () => {
                const expectedMock = { ...mockEntity, status: EStatus.INCOMPLETE };
                jest.spyOn(service.queries, 'findOne').mockResolvedValueOnce(expectedMock);
                const result = await service['validateEntity']('pokemon', false);
                expect(result).toEqual(expectedMock);
            });

            it('should return a pokemon when has status incomplete in database.', async () => {
                const expectedMock = { ...mockEntity, status: EStatus.INCOMPLETE };
                jest.spyOn(service.queries, 'findOne').mockResolvedValueOnce(expectedMock);
                jest.spyOn(service, 'completingPokemonData' as any).mockResolvedValueOnce(mockEntity);
                const result = await service['validateEntity']('pokemon');
                expect(result).toEqual(mockEntity);
            });
        });

        describe('completingPokemonData', () => {
            it('should completing pokemon successfully.', async () => {
                const expectedMock = { ...mockEntity, moves: [pokemonMoveMockEntity], types: [pokemonTypeMockEntity], abilities: [pokemonAbilityMockEntity], evolutions: [mockEntity] };
                jest.spyOn(pokeApiService, 'getByName').mockResolvedValueOnce(mockEntity);

                jest.spyOn(moveService, 'findList').mockResolvedValueOnce([pokemonMoveMockEntity]);
                jest.spyOn(typeService, 'findList').mockResolvedValueOnce([pokemonTypeMockEntity]);
                jest.spyOn(abilityService, 'findList').mockResolvedValueOnce([pokemonAbilityMockEntity]);
                jest.spyOn(service, 'findEvolutions' as any).mockResolvedValueOnce([mockEntity]);

                jest.spyOn(service, 'save').mockResolvedValueOnce(expectedMock);
                jest.spyOn(service, 'validateEntity' as any).mockResolvedValueOnce(expectedMock);
                const result = await service['completingPokemonData']({ ...mockEntity, status: EStatus.INCOMPLETE });
                expect(result.name).toEqual(mockEntity.name);
                expect(result.moves.length).toEqual(1);
                expect(result.types.length).toEqual(1);
                expect(result.abilities.length).toEqual(1);
                expect(result.status).toEqual(EStatus.COMPLETE);
            });
        });

        describe('findEvolutions', () => {
            it('should return undefined when url is undefined', async () => {
                const result = await service['findEvolutions'](undefined);
                expect(result).toBeUndefined();
            });

            it('should return a list of pokemon when url is defined', async () => {
                jest.spyOn(pokeApiService, 'getEvolutions').mockResolvedValueOnce([mockEntity.name]);
                jest.spyOn(service, 'validateEntity' as any).mockResolvedValueOnce(mockEntity);
                const result = await service['findEvolutions']('/pokemon/url');
                expect(result).toEqual([mockEntity]);
            });
        });

        describe('validatePokemonSeedsDto', () => {
            it('should validate seeds dto', () => {
                const result = service['validatePokemonSeedsDto'](createPokemonSeedsDto);
                expect(result).toEqual(createPokemonSeedsDto);
            });
        });

        describe('mapperPokemonSeedsResult', () => {
            it('should map seeds result', () => {
                const result = service['mapperPokemonSeedsResult'](pokemonGenerateSeeds);
                expect(result).toEqual(pokemonSeedsResult);
            });
        })

        describe('generateSeed', () => {
            it('should generate a pokemon seed', async () => {
                const result = await service['generateSeed'](true, '');
                expect(result).toEqual({ list: [], added: []});
            });

            it('should return empty list when flag withSeed is false', async () => {
                const result = await service['generateSeed'](false, '');
                expect(result).toEqual({ list: [], added: []});
            });
        });

        describe('persistSeed', () => {
            it('should persist a pokemon seed', async () => {
                const result = await service['persistSeed'](true);
                expect(result).toEqual({ list: [], added: []});
            });

            it('should return empty list when flag withSeed is false', async () => {
                const result = await service['persistSeed'](false);
                expect(result).toEqual({ list: [], added: []});
            });
        });
    });
});