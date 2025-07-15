import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Http } from '@repo/services';

import { Evolution } from './evolution';
import { Move } from './move';
import { PokeApi } from './poke-api';
import { Specie } from './specie';

jest.mock('@repo/services');
jest.mock('./specie');
jest.mock('./move');
jest.mock('./evolution');

describe('PokeApi', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let pokeApi: PokeApi;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        pokeApi = new PokeApi( { baseUrl: mockBaseUrl } );
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('specieModule', () => {
        it('should initialize Specie module', () => {
            expect(Specie).toHaveBeenCalledTimes(1);
            expect(Specie).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of Specie via specie getter', () => {
            const specieModule = pokeApi.specie;
            expect(specieModule).toBeInstanceOf(Specie);
            expect(Specie).toHaveBeenCalledTimes(1);
        });
    });

    describe('moveModule', () => {
        it('should initialize Move module', () => {
            expect(Move).toHaveBeenCalledTimes(1);
            expect(Move).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of Move via move getter', () => {
            const moveModule = pokeApi.move;
            expect(moveModule).toBeInstanceOf(Move);
            expect(Move).toHaveBeenCalledTimes(1);
        });
    });

    describe('evolutionModule', () => {
        it('should initialize Evolution module', () => {
            expect(Evolution).toHaveBeenCalledTimes(1);
            expect(Evolution).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of Evolution via specie getter', () => {
            const evolutionModule = pokeApi.evolution;
            expect(evolutionModule).toBeInstanceOf(Evolution);
            expect(Evolution).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAll', () => {
        it('should call get with correct URL and parameters for getAll', async () => {
            const mockedGet = jest.spyOn(Http.prototype, 'get').mockResolvedValue({
                results: [],
                count: 0,
            });

            const offset = 20;
            const limit = 10;

            await pokeApi.getAll(offset, limit);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith('pokemon', {
                params: { offset, limit },
            });
        });
    });

    describe('getByName', () => {
        it('should call get with correct URL for getByName', async () => {
            const mockedGet = jest.spyOn(Http.prototype, 'get').mockResolvedValue({
                id: 1,
                name: 'bulbasaur',
            });

            const name = 'bulbasaur';

            await pokeApi.getByName(name);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith(`pokemon/${name}`);
        });
    });
});
