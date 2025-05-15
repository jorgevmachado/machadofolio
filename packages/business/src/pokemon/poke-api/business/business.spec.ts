import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import {
    POKEMON_BY_NAME_RESPONSE_MOCK,
    POKEMON_ENTITY_INITIAL_BY_NAME_MOCK,
    POKEMON_ENTITY_INITIAL_MOCK,
    SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK
} from '../mock';
import type { PokemonByNameResponse, PokemonSpecieResponse } from '../types';

import type { EnsureImageParams } from './types';
import PokeApiBusiness from './business';

import Pokemon from '../../pokemon';
import type { PokemonEntity } from '../../types';

describe('Poke-api Business', () => {
    let business: PokeApiBusiness;
    const pokemonEntityInitial: PokemonEntity = POKEMON_ENTITY_INITIAL_MOCK;
    const pokemonByNameResponseMock: PokemonByNameResponse = POKEMON_BY_NAME_RESPONSE_MOCK;
    const speciePokemonByNameResponseMock: PokemonSpecieResponse = SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK;
    const pokemonEntityInitialByNameMock: PokemonEntity = POKEMON_ENTITY_INITIAL_BY_NAME_MOCK;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        business = new PokeApiBusiness();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('ensureImage', () => {
        it('Should return a string empty', () => {
            const mockEnsureImageParams: EnsureImageParams = {
                image: undefined,
                sprites: undefined,
            };
            const image = business.ensureImage(mockEnsureImageParams);
            expect(image).toEqual('');
        });

        it('Should return a current image by param image', () => {
            const mockEnsureImageParamsCurrentImage: EnsureImageParams = {
                image: 'https://pokemon-mock/image/1.png',
                sprites: undefined
            };
            const image = business.ensureImage(mockEnsureImageParamsCurrentImage);
            expect(image).toEqual(mockEnsureImageParamsCurrentImage.image);
        });

        it('Should return a image by sprites param front_default', () => {
            const mockEnsureImageParamsFrontDefault: EnsureImageParams = {
                sprites: pokemonByNameResponseMock.sprites,
            };
            const image = business.ensureImage(mockEnsureImageParamsFrontDefault);
            expect(image).toEqual(mockEnsureImageParamsFrontDefault.sprites.front_default);
        });

        it('Should return a image by sprites param dream_world', () => {
            const mockEnsureImageParamsFrontDefault: EnsureImageParams = {
                sprites: {
                    front_default: undefined,
                    other: {
                        dream_world: {
                            front_default: 'https://pokemon-mock/other/dream_world/front/1.png',
                        }
                    },
                }
            };
            const image = business.ensureImage(mockEnsureImageParamsFrontDefault);
            expect(image).toEqual(mockEnsureImageParamsFrontDefault.sprites.other.dream_world.front_default);
        });

        it('Should return a image default when sprites values is undefined', () => {
            const mockEnsureImageParamsFrontDefault: EnsureImageParams = {
                sprites: {
                    front_default: undefined,
                    other: {
                        dream_world: {
                            front_default: undefined,
                        }
                    },
                }
            };
            const image = business.ensureImage(mockEnsureImageParamsFrontDefault);
            expect(image).toEqual('');
        });
    });

    describe('ensureAttributes', () => {
        it('Should return default values when array is empty', () => {
            const result = business.ensureAttributes([]);
            expect(result.hp).toEqual(0);
            expect(result.speed).toEqual(0);
            expect(result.attack).toEqual(0);
            expect(result.defense).toEqual(0);
            expect(result.special_attack).toEqual(0);
            expect(result.special_defense).toEqual(0);
        });

        it('Should return successfully all values', () => {
            const result = business.ensureAttributes(POKEMON_BY_NAME_RESPONSE_MOCK.stats);
            expect(result.hp).toEqual(pokemonEntityInitialByNameMock.hp);
            expect(result.speed).toEqual(pokemonEntityInitialByNameMock.speed);
            expect(result.attack).toEqual(pokemonEntityInitialByNameMock.attack);
            expect(result.defense).toEqual(pokemonEntityInitialByNameMock.defense);
            expect(result.special_attack).toEqual(pokemonEntityInitialByNameMock.special_attack);
            expect(result.special_defense).toEqual(pokemonEntityInitialByNameMock.special_defense);
        });
    });

    describe('ensureSpecieAttributes', () => {
        it('Should return successfully all values', () => {
            const result = business.ensureSpecieAttributes(speciePokemonByNameResponseMock);
            expect(result.habitat).toEqual(pokemonEntityInitialByNameMock.habitat);
            expect(result.is_baby).toBeFalsy();
            expect(result.shape_url).toEqual(pokemonEntityInitialByNameMock.shape_url);
            expect(result.shape_name).toEqual(pokemonEntityInitialByNameMock.shape_name);
            expect(result.is_mythical).toEqual(pokemonEntityInitialByNameMock.is_mythical);
            expect(result.gender_rate).toEqual(pokemonEntityInitialByNameMock.gender_rate);
            expect(result.is_legendary).toEqual(pokemonEntityInitialByNameMock.is_legendary);
            expect(result.capture_rate).toEqual(pokemonEntityInitialByNameMock.capture_rate);
            expect(result.hatch_counter).toEqual(pokemonEntityInitialByNameMock.hatch_counter);
            expect(result.base_happiness).toEqual(pokemonEntityInitialByNameMock.base_happiness);
            expect(result.evolution_chain_url).toEqual(pokemonEntityInitialByNameMock.evolution_chain_url);
            expect(result.evolves_from_species).toEqual(pokemonEntityInitialByNameMock.evolves_from_species);
            expect(result.has_gender_differences).toEqual(pokemonEntityInitialByNameMock.has_gender_differences);
        });
    });

    describe('ensureRelations', () => {
        it('Should return a empty values when received empty values', () => {
            const result = business.ensureRelations({
                ...pokemonByNameResponseMock,
                types: [],
                moves: [],
                abilities: []
            });
            expect(result.types).toEqual([]);
            expect(result.moves).toEqual([]);
            expect(result.abilities).toEqual([]);
        });

        it('Should return successfully all values', () => {
            const result = business.ensureRelations(pokemonByNameResponseMock);
            expect(result.types).toEqual(pokemonEntityInitialByNameMock.types);
            expect(result.moves).toEqual(pokemonEntityInitialByNameMock.moves);
            expect(result.abilities).toEqual(pokemonEntityInitialByNameMock.abilities);
        });
    });

    describe('convertResponseToPokemon', () => {
        it('Should Convert Responses to Pokemon', () => {
            const entity = business.convertResponseToPokemon(
                pokemonEntityInitial,
                pokemonByNameResponseMock,
                speciePokemonByNameResponseMock
            );
            expect(entity).toBeInstanceOf(Pokemon);
            expect(entity.id).toEqual(pokemonEntityInitialByNameMock.id);
            expect(entity.hp).toEqual(pokemonEntityInitialByNameMock.hp);
            expect(entity.url).toEqual(pokemonEntityInitialByNameMock.url);
            expect(entity.name).toEqual(pokemonEntityInitialByNameMock.name);
            expect(entity.order).toEqual(pokemonEntityInitialByNameMock.order);
            expect(entity.image).toEqual(pokemonEntityInitialByNameMock.image);
            expect(entity.speed).toEqual(pokemonEntityInitialByNameMock.speed);
            expect(entity.moves).toEqual(pokemonEntityInitialByNameMock.moves);
            expect(entity.types).toEqual(pokemonEntityInitialByNameMock.types);
            expect(entity.status).toEqual(pokemonEntityInitialByNameMock.status);
            expect(entity.attack).toEqual(pokemonEntityInitialByNameMock.attack);
            expect(entity.defense).toEqual(pokemonEntityInitialByNameMock.defense);
            expect(entity.habitat).toEqual(pokemonEntityInitialByNameMock.habitat);
            expect(entity.is_baby).toEqual(pokemonEntityInitialByNameMock.is_baby);
            expect(entity.shape_url).toEqual(pokemonEntityInitialByNameMock.shape_url);
            expect(entity.abilities).toEqual(pokemonEntityInitialByNameMock.abilities);
            expect(entity.created_at).toEqual(pokemonEntityInitialByNameMock.created_at);
            expect(entity.updated_at).toEqual(pokemonEntityInitialByNameMock.updated_at);
            expect(entity.deleted_at).toEqual(pokemonEntityInitialByNameMock.deleted_at);
            expect(entity.evolutions).toEqual(pokemonEntityInitialByNameMock.evolutions);
            expect(entity.shape_name).toEqual(pokemonEntityInitialByNameMock.shape_name);
            expect(entity.is_mythical).toEqual(pokemonEntityInitialByNameMock.is_mythical);
            expect(entity.gender_rate).toEqual(pokemonEntityInitialByNameMock.gender_rate);
            expect(entity.is_legendary).toEqual(pokemonEntityInitialByNameMock.is_legendary);
            expect(entity.capture_rate).toEqual(pokemonEntityInitialByNameMock.capture_rate);
            expect(entity.hatch_counter).toEqual(pokemonEntityInitialByNameMock.hatch_counter);
            expect(entity.base_happiness).toEqual(pokemonEntityInitialByNameMock.base_happiness);
            expect(entity.special_attack).toEqual(pokemonEntityInitialByNameMock.special_attack);
            expect(entity.special_defense).toEqual(pokemonEntityInitialByNameMock.special_defense);
            expect(entity.evolution_chain_url).toEqual(pokemonEntityInitialByNameMock.evolution_chain_url);
            expect(entity.evolves_from_species).toEqual(pokemonEntityInitialByNameMock.evolves_from_species);
            expect(entity.has_gender_differences).toEqual(pokemonEntityInitialByNameMock.has_gender_differences);
        });
    });
});