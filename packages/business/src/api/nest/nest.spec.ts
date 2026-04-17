import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

jest.mock('./auth', () => ({ Auth: jest.fn() }));
jest.mock('./finance', () => ({ Finance: jest.fn() }));
jest.mock('./pokemon', () => ({ Pokemon: jest.fn() }));

import { Auth }  from './auth';
import { Finance } from'./finance';
import { Pokemon } from'./pokemon';
import { Nest } from './nest';
import type { INestConfig } from './types';


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
            expect(instance.auth).toBeInstanceOf(Auth);
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
            expect(instance.finance).toBeInstanceOf(Finance);
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
            expect(instance.pokemon).toBeInstanceOf(Pokemon);
        });
    });

    describe('Nest constructor edge cases', () => {
        it('should throw if baseUrl is missing', () => {
            expect(() => new Nest({ token: mockToken } as INestConfig)).toThrow();
        });

        it('should throw if token is missing', () => {
            const result = new Nest({ baseUrl: mockBaseUrl });
            expect(result).toBeInstanceOf(Nest);
            expect(Auth).toHaveBeenCalledTimes(1);
            expect(Finance).toHaveBeenCalledTimes(1);
            expect(Pokemon).toHaveBeenCalledTimes(1);
        });

        it('should create multiple instances independently', () => {
            const instance1 = new Nest({ baseUrl: mockBaseUrl, token: mockToken });
            const instance2 = new Nest({ baseUrl: mockBaseUrl, token: mockToken });
            expect(instance1).not.toBe(instance2);
            expect(Auth).toHaveBeenCalledTimes(2);
            expect(Finance).toHaveBeenCalledTimes(2);
            expect(Pokemon).toHaveBeenCalledTimes(2);
        });
    });
});