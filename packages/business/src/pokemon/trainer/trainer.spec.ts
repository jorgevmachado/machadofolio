import { afterEach ,beforeEach ,expect ,it ,jest } from '@jest/globals';

import type { PokemonTrainerEntity } from './types';
import { POKEDEX_MOCK ,POKEMON_TRAINER_MOCK } from '../mock';
import PokemonTrainer from './trainer';
import { PokedexEntity } from '../pokedex';

describe('Pokemon Trainer', () => {
  const entityMock: PokemonTrainerEntity = POKEMON_TRAINER_MOCK as unknown as PokemonTrainerEntity;
  const pokedexEntityMock = POKEDEX_MOCK as unknown as PokedexEntity;
  entityMock.pokedex = [pokedexEntityMock];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Constructor' ,() => {
    it('should create an instance Pokemon with all provided parameters', () => {
      const entity = new PokemonTrainer(entityMock);
      expect(entity).toBeInstanceOf(PokemonTrainer);
      expect(entity.id).toEqual(entityMock.id);
      expect(entity.user).toEqual(entityMock.user);
      expect(entity.created_at).toEqual(entityMock.created_at);
      expect(entity.updated_at).toEqual(entityMock.updated_at);
      expect(entity.deleted_at).toEqual(entityMock.deleted_at);
      expect(entity.capture_rate).toEqual(entityMock.capture_rate);
      expect(entity.pokedex).toEqual(entityMock.pokedex);
      expect(entity.captured_pokemons).toEqual(entityMock.captured_pokemons);
    });

    it('should create an instance Pokemon with only required parameters', () => {
      const entity = new PokemonTrainer({
        id: entityMock.id,
        user: entityMock.user,
      });
      expect(entity).toBeInstanceOf(PokemonTrainer);
      expect(entity.id).toEqual(entityMock.id);
      expect(entity.user).toEqual(entityMock.user);
      expect(entity.pokedex).toEqual([]);
      expect(entity.created_at).toBeUndefined();
      expect(entity.updated_at).toBeUndefined();
      expect(entity.deleted_at).toBeUndefined();
      expect(entity.capture_rate).toEqual(45);
      expect(entity.captured_pokemons).toEqual([]);
    });

    it('should create an instance Pokemon without params', () => {
      const entity = new PokemonTrainer();
      expect(entity).toBeInstanceOf(PokemonTrainer);
    });
  });
});