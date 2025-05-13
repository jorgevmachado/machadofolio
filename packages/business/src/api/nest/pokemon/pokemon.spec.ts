import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { NestModuleAbstract } from '../abstract';

import { Ability } from './ability';
import { Move } from './move';
import { Pokemon } from './pokemon';
import { Type } from './type';

jest.mock('../abstract');
jest.mock('./ability');
jest.mock('./move');
jest.mock('./type');

describe('Pokemon', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let pokemon: Pokemon;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        pokemon = new Pokemon(mockConfig);
    });

    afterEach(() => {
        jest.resetModules();
    });
    describe('constructor', () => {
        it('should initialize with the correct path and config', () => {
            expect(pokemon).toBeDefined();
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'pokemon',
                nestModuleConfig: mockConfig,
            });
        });
    });

    describe('pokemonAbilityModule', () => {
        it('should initialize PokemonAbility module', () => {
            expect(Ability).toHaveBeenCalledTimes(1);
            expect(Ability).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of PokemonAbility via ability getter', () => {
            const abilityModule = pokemon.ability;
            expect(abilityModule).toBeInstanceOf(Ability);
            expect(Ability).toHaveBeenCalledTimes(1);
        });
    });

    describe('pokemonMoveModule', () => {
        it('should initialize PokemonMove module', () => {
            expect(Move).toHaveBeenCalledTimes(1);
            expect(Move).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of PokemonMove via move getter', () => {
            const moveModule = pokemon.move;
            expect(moveModule).toBeInstanceOf(Move);
            expect(Move).toHaveBeenCalledTimes(1);
        });
    });

    describe('pokemonTypeModule', () => {
        it('should initialize PokemonType module', () => {
            expect(Type).toHaveBeenCalledTimes(1);
            expect(Type).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of PokemonType via type getter', () => {
            const typeModule = pokemon.type;

            expect(typeModule).toBeInstanceOf(Type);
            expect(Type).toHaveBeenCalledTimes(1);
        });
    });
});