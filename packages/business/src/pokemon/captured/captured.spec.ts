import { afterEach ,beforeEach ,expect ,it ,jest } from '@jest/globals';

import { CAPTURED_POKEMON_MOCK } from '../mock';

import { CapturedPokemonEntity } from './types';

import CapturedPokemon from './captured';

describe('Captured pokemon' ,() => {
  const entityMock: CapturedPokemonEntity = CAPTURED_POKEMON_MOCK as unknown as CapturedPokemonEntity;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Constructor' ,() => {
    it(
      'should create an instance captured pokemon with all provided parameters' ,
      () => {
        const entity = new CapturedPokemon(entityMock);
        expect(entity).toBeInstanceOf(CapturedPokemon);
        expect(entity.id).toEqual(entityMock.id);
        expect(entity.hp).toEqual(entityMock.hp);
        expect(entity.wins).toEqual(entityMock.wins);
        expect(entity.level).toEqual(entityMock.level);
        expect(entity.max_hp).toEqual(entityMock.max_hp);
        expect(entity.losses).toEqual(entityMock.losses);
        expect(entity.battles).toEqual(entityMock.battles);
        expect(entity.pokemon).toBe(entityMock.pokemon);
        expect(entity.trainer).toBe(entityMock.trainer);
        expect(entity.experience).toEqual(entityMock.experience);
        expect(entity.captured_at).toEqual(
          entityMock.captured_at ,
        );
        expect(entity.nickname).toEqual(entityMock.nickname);
        expect(entity.created_at).toEqual(
          entityMock.created_at ,
        );
        expect(entity.updated_at).toEqual(
          entityMock.updated_at ,
        );
        expect(entity.deleted_at).toBe(entityMock.deleted_at);
      });

    it('should create an instance with some provided parameters' ,() => {
      const entity = new CapturedPokemon({
        trainer: entityMock.trainer ,
        pokemon: entityMock.pokemon ,
        captured_at: entityMock.captured_at ,
      });
      expect(entity).toBeInstanceOf(CapturedPokemon);
      expect(entity.id).toBeUndefined();
      expect(entity.hp).toEqual(0);
      expect(entity.wins).toEqual(0);
      expect(entity.level).toEqual(1);
      expect(entity.max_hp).toEqual(0);
      expect(entity.losses).toEqual(0);
      expect(entity.battles).toEqual(0)
      expect(entity.trainer).toBe(entityMock.trainer);
      expect(entity.experience).toEqual(0);
      expect(entity.pokemon).toBe(entityMock.pokemon);
      expect(entity.captured_at).toEqual(
        entityMock.captured_at ,
      );
      expect(entity.nickname).toBeUndefined();
      expect(entity.created_at).toBeUndefined();
      expect(entity.updated_at).toBeUndefined();
      expect(entity.deleted_at).toBeUndefined();
    });
  });
});