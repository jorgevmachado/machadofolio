jest.mock('@repo/services', () => ({
    Http: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        post: jest.fn(),
        path: jest.fn(),
        remove: jest.fn(),
    }))
}));

const mockGet = jest.fn<(...args: any[]) => Promise<any>>();

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Specie } from './specie';

describe('PokeApi Specie', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let specie: Specie;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        (Specie.prototype as any).get = mockGet;
        specie = new Specie(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });


    describe('getByPokemonName', () => {
        it('should call get with correct URL for getByPokemonName', async () => {
            mockGet.mockResolvedValue({
                color: { name: 'green' },
                id: 1,
            });

            const name = 'pokemon_name';

            await specie.getByPokemonName(name);

            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith(`pokemon-species/${name}`);
        });
    });
});
