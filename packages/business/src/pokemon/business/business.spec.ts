import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import TrainerBusiness from './business';
import { POKEMON_MOCK } from '../mock';
import Pokemon from '../pokemon';

describe('Pokemon Business', () => {
  let business: TrainerBusiness;
  const pokemonEntity = POKEMON_MOCK as unknown as Pokemon;
  const mockPokemons: Array<Pokemon> = [pokemonEntity];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    business = new TrainerBusiness();
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('firstTrainerPokemon', () => {
    it('should return undefined when list of pokemons is empty', () => {
      const result = business.firstTrainerPokemon([], 'bulbasaur');
      expect(result).toBeUndefined();
    });

    it('should return the first pokemon in the list', () => {
      const result = business.firstTrainerPokemon(mockPokemons, 'pokemon');
      expect(result).toEqual(pokemonEntity);
    });

    it('should return the first complete pokemon in the list', () => {
      const result = business.firstTrainerPokemon(mockPokemons, 'bulbasaur');
      expect(result).toEqual(pokemonEntity);
    });

    it('should return the random complete pokemon in the list', () => {
      const pokemonEntityIncomplete = new Pokemon({ ...pokemonEntity, status: 'INCOMPLETE' });
      const result = business.firstTrainerPokemon([pokemonEntityIncomplete], 'charmander');
      expect(result).toEqual(pokemonEntityIncomplete);
    });
  });
});