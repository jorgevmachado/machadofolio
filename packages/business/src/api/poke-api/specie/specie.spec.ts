import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Http } from '@repo/services/http/http';

import { Specie } from './specie';

jest.mock('@repo/services/http/http');

describe('PokeApi Specie', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let specie: Specie;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        specie = new Specie(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('getByPokemonName', () => {
        it('should call get with correct URL for getByPokemonName', async () => {
            const mockedGet = jest.spyOn(Http.prototype, 'get').mockResolvedValue({
                color: { name: 'green' },
                id: 1,
            });

            const name = 'pokemon_name';

            await specie.getByPokemonName(name);

            expect(mockedGet).toHaveBeenCalledTimes(1);
            expect(mockedGet).toHaveBeenCalledWith(`pokemon-species/${name}`);
        });
    });
});
