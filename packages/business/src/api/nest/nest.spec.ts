import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Auth } from './auth';
import { Finance } from './finance';
import { Nest } from './nest';
import { Pokemon } from './pokemon';

jest.mock('./auth');
jest.mock('./finance');
jest.mock('./pokemon');

describe('Nest', () => {
    const mockBaseUrl = 'http://test-url.com';
    const mockToken = 'test-token';
    const mockHeaders = {
        Authorization: `Bearer ${mockToken}`,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('AuthModule', () => {
        it('should create the Auth module with correct config', () => {
            new Nest({ baseUrl: mockBaseUrl, token: mockToken });

            expect(Auth).toHaveBeenCalledTimes(1);
            expect(Auth).toHaveBeenCalledWith({
                baseUrl: mockBaseUrl,
                headers: mockHeaders,
            });
        });

        it('should expose the auth property', () => {
            const instance = new Nest({ baseUrl: mockBaseUrl, token: mockToken });
            const authInstance = instance.auth;

            expect(authInstance).toBeInstanceOf(Auth);
            expect(Auth).toHaveBeenCalledTimes(1);
        });
    });

    describe('FinanceModule', () => {
        it('should create the Finance module with correct config', () => {
            new Nest({ baseUrl: mockBaseUrl, token: mockToken });

            expect(Finance).toHaveBeenCalledTimes(1);
            expect(Finance).toHaveBeenCalledWith({
                baseUrl: mockBaseUrl,
                headers: mockHeaders,
            });
        });

        it('should expose the finance property', () => {
            const instance = new Nest({ baseUrl: mockBaseUrl, token: mockToken });
            const financeInstance = instance.finance;

            expect(financeInstance).toBeInstanceOf(Finance);
            expect(Finance).toHaveBeenCalledTimes(1);
        });
    });
    describe('PokemonModule', () => {
        it('should create the Pokemon module with correct config', () => {
            new Nest({ baseUrl: mockBaseUrl, token: mockToken });

            expect(Pokemon).toHaveBeenCalledTimes(1);
            expect(Pokemon).toHaveBeenCalledWith({
                baseUrl: mockBaseUrl,
                headers: mockHeaders,
            });
        });

        it('should expose the pokemon property', () => {
            const instance = new Nest({ baseUrl: mockBaseUrl, token: mockToken });
            const pokemonInstance = instance.pokemon;

            expect(pokemonInstance).toBeInstanceOf(Pokemon);
            expect(Pokemon).toHaveBeenCalledTimes(1);
        });
    });
});