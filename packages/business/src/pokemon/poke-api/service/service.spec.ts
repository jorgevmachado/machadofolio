import { afterEach, beforeEach, describe, expect, jest } from '@jest/globals';

import { type PokeApi } from '../../../api';

import type { PokemonEntity } from '../../types';

import {
    POKEMON_BY_NAME_RESPONSE_MOCK,
    POKEMON_ENTITY_INITIAL_BY_NAME_MOCK,
    POKEMON_ENTITY_INITIAL_MOCK,
    POKEMON_RESPONSE_MOCK,
    SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK
} from '../mock';
import type { PokemonByNameResponse, PokemonPaginateResponse, PokemonResponse, PokemonSpecieResponse } from '../types';

import { PokeApiService } from './service';
import Pokemon from '../../pokemon';

jest.mock('../../../api');

describe('Poke Api Service', () => {
    let service: PokeApiService;
    let mockPokeApi: jest.Mocked<PokeApi>;
    const pokemonResponseList: Array<PokemonResponse> = [
        POKEMON_RESPONSE_MOCK,
        {
            url: 'http://pokemon-mock/2/',
            name: 'pokemon-2',
        },
    ];
    const pokemonInitialMock: PokemonEntity = POKEMON_ENTITY_INITIAL_MOCK;
    const pokemonEntityInitialByNameMock: PokemonEntity = POKEMON_ENTITY_INITIAL_BY_NAME_MOCK;
    const pokemonByNameResponseMock: PokemonByNameResponse = POKEMON_BY_NAME_RESPONSE_MOCK;
    const speciePokemonByNameResponseMock: PokemonSpecieResponse = SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockPokeApi = {
            getAll: jest.fn(),
            getByName: jest.fn(),
            specie: {
                getByPokemonName: jest.fn()
            }
        } as unknown as jest.Mocked<PokeApi>;

        service = new PokeApiService();
        (service as any).pokeApi = mockPokeApi;
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('getAll', () => {
        it('should return a list of pokemon using poke-api', async () => {
            const mockResponse: PokemonPaginateResponse<PokemonResponse> = {
                count: 1302,
                next: 'http://pokemon-mock/pokemon?offset=1302&limit=2',
                previous: undefined,
                results: pokemonResponseList,
            };

            mockPokeApi.getAll.mockResolvedValue(mockResponse);
            const response = await service.getAll({ offset: 0, limit: 2 });
            expect(mockPokeApi.getAll).toHaveBeenCalledWith(0, 2);
            expect(response).toHaveLength(2);
            expect(response[0]).toEqual({
                ...pokemonInitialMock,
                url: pokemonResponseList[0].url,
                name: pokemonResponseList[0].name,
                order: 1
            });
            expect(response[1]).toEqual({
                ...pokemonInitialMock,
                url: pokemonResponseList[1].url,
                name: pokemonResponseList[1].name,
                order: 2
            });
        });
    });

    describe('getByName', () => {
        it('should return a pokemon by name using poke-api', async () => {

            mockPokeApi.getByName.mockResolvedValue(pokemonByNameResponseMock);
            mockPokeApi.specie.getByPokemonName.mockResolvedValue(speciePokemonByNameResponseMock);
            const response = await service.getByName(pokemonInitialMock);
            expect(mockPokeApi.getByName).toHaveBeenCalledWith(pokemonInitialMock.name);
            expect(mockPokeApi.specie.getByPokemonName).toHaveBeenCalledWith(pokemonInitialMock.name);
            expect(response).toBeInstanceOf(Pokemon);
            expect(response.id).toEqual(pokemonEntityInitialByNameMock.id);
            expect(response.hp).toEqual(pokemonEntityInitialByNameMock.hp);
            expect(response.url).toEqual(pokemonEntityInitialByNameMock.url);
            expect(response.name).toEqual(pokemonEntityInitialByNameMock.name);
            expect(response.order).toEqual(pokemonEntityInitialByNameMock.order);
            expect(response.image).toEqual(pokemonEntityInitialByNameMock.image);
            expect(response.speed).toEqual(pokemonEntityInitialByNameMock.speed);
            expect(response.moves).toEqual(pokemonEntityInitialByNameMock.moves);
            expect(response.types).toEqual(pokemonEntityInitialByNameMock.types);
            expect(response.status).toEqual(pokemonEntityInitialByNameMock.status);
            expect(response.attack).toEqual(pokemonEntityInitialByNameMock.attack);
            expect(response.defense).toEqual(pokemonEntityInitialByNameMock.defense);
            expect(response.habitat).toEqual(pokemonEntityInitialByNameMock.habitat);
            expect(response.is_baby).toEqual(pokemonEntityInitialByNameMock.is_baby);
            expect(response.shape_url).toEqual(pokemonEntityInitialByNameMock.shape_url);
            expect(response.abilities).toEqual(pokemonEntityInitialByNameMock.abilities);
            expect(response.created_at).toEqual(pokemonEntityInitialByNameMock.created_at);
            expect(response.updated_at).toEqual(pokemonEntityInitialByNameMock.updated_at);
            expect(response.deleted_at).toEqual(pokemonEntityInitialByNameMock.deleted_at);
            expect(response.evolutions).toEqual(pokemonEntityInitialByNameMock.evolutions);
            expect(response.shape_name).toEqual(pokemonEntityInitialByNameMock.shape_name);
            expect(response.is_mythical).toEqual(pokemonEntityInitialByNameMock.is_mythical);
            expect(response.gender_rate).toEqual(pokemonEntityInitialByNameMock.gender_rate);
            expect(response.is_legendary).toEqual(pokemonEntityInitialByNameMock.is_legendary);
            expect(response.capture_rate).toEqual(pokemonEntityInitialByNameMock.capture_rate);
            expect(response.hatch_counter).toEqual(pokemonEntityInitialByNameMock.hatch_counter);
            expect(response.base_happiness).toEqual(pokemonEntityInitialByNameMock.base_happiness);
            expect(response.special_attack).toEqual(pokemonEntityInitialByNameMock.special_attack);
            expect(response.special_defense).toEqual(pokemonEntityInitialByNameMock.special_defense);
            expect(response.evolution_chain_url).toEqual(pokemonEntityInitialByNameMock.evolution_chain_url);
            expect(response.evolves_from_species).toEqual(pokemonEntityInitialByNameMock.evolves_from_species);
            expect(response.has_gender_differences).toEqual(pokemonEntityInitialByNameMock.has_gender_differences);
        });
    });
});