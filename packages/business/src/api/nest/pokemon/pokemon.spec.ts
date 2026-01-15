import { Trainer } from './trainer';

jest.mock('../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();

        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
        }
    }

    return { NestModuleAbstract };
});

jest.mock('./ability', () => ({ Ability: jest.fn() }));
jest.mock('./move', () => ({ Move: jest.fn() }));
jest.mock('./type', () => ({ Type: jest.fn() }));
jest.mock('./captured', () => ({ Captured: jest.fn() }));
jest.mock('./trainer', () => ({ Trainer: jest.fn() }));

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Ability } from './ability';
import { Move } from './move';
import { Pokemon } from './pokemon';
import { Type } from './type';
import { Captured } from './captured';

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

    describe('pokemonCapturedModule', () => {
        it('should initialize Pokemon Captured module', () => {
            expect(Captured).toHaveBeenCalledTimes(1);
            expect(Captured).toHaveBeenCalledWith(mockConfig);
        });

        it('should return the instance of PokemonCaptured via type getter', () => {
            const capturedModule = pokemon.captured;

            expect(capturedModule).toBeInstanceOf(Captured);
            expect(Captured).toHaveBeenCalledTimes(1);
        });
    });

    describe('pokemonTrainerModule', () => {
    it('should initialize Pokemon Trainer module', () => {
      expect(Trainer).toHaveBeenCalledTimes(1);
      expect(Trainer).toHaveBeenCalledWith(mockConfig);
    });

    it('should return the instance of Pokemon trainer via type getter', () => {
      const trainerModule = pokemon.trainer;

      expect(trainerModule).toBeInstanceOf(Trainer);
      expect(Trainer).toHaveBeenCalledTimes(1);
    });
  });
});