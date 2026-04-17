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
        expect(entity.iv_hp).toEqual(entityMock.iv_hp);
        expect(entity.ev_hp).toEqual(entityMock.ev_hp);
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
        expect(entity.iv_speed).toEqual(entityMock.iv_speed);
        expect(entity.ev_speed).toEqual(entityMock.ev_speed);
        expect(entity.iv_attack).toEqual(entityMock.iv_attack);
        expect(entity.ev_attack).toEqual(entityMock.ev_attack);
        expect(entity.iv_defense).toEqual(entityMock.iv_defense);
        expect(entity.ev_defense).toEqual(entityMock.ev_defense);
        expect(entity.created_at).toEqual(
          entityMock.created_at ,
        );
        expect(entity.updated_at).toEqual(
          entityMock.updated_at ,
        );
        expect(entity.deleted_at).toBe(entityMock.deleted_at);
        expect(entity.iv_special_attack).toBe(entityMock.iv_special_attack);
        expect(entity.ev_special_attack).toBe(entityMock.ev_special_attack);
        expect(entity.iv_special_defense).toBe(entityMock.iv_special_defense);
        expect(entity.ev_special_defense).toBe(entityMock.ev_special_defense);
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
      expect(entity.iv_hp).toEqual(0);
      expect(entity.ev_hp).toEqual(0);
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
      expect(entity.iv_speed).toEqual(0);
      expect(entity.ev_speed).toEqual(0);
      expect(entity.iv_attack).toEqual(0);
      expect(entity.ev_attack).toEqual(0);
      expect(entity.ev_defense).toEqual(0);
      expect(entity.ev_defense).toEqual(0);
      expect(entity.created_at).toBeUndefined();
      expect(entity.updated_at).toBeUndefined();
      expect(entity.deleted_at).toBeUndefined();
      expect(entity.iv_special_attack).toEqual(0);
      expect(entity.ev_special_attack).toEqual(0);
      expect(entity.iv_special_defense).toEqual(0);
      expect(entity.ev_special_defense).toEqual(0);
    });
  });
});