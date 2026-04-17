import { PokedexEntity } from './types';
import { POKEDEX_MOCK } from '../mock';
import { afterEach ,beforeEach ,expect ,it ,jest } from '@jest/globals';
import Pokedex from './pokedex';

describe('Pokedex' ,() => {
  const entityMock = POKEDEX_MOCK as unknown as PokedexEntity;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Constructor' ,() => {});
  it('should create an instance captured pokemon with all provided parameters', () => {
    const entity = new Pokedex(entityMock);
    expect(entity).toBeInstanceOf(Pokedex);
    expect(entity.id).toEqual(entityMock.id);
    expect(entity.hp).toEqual(entityMock.hp);
    expect(entity.wins).toEqual(entityMock.wins);
    expect(entity.level).toEqual(entityMock.level);
    expect(entity.iv_hp).toEqual(entityMock.iv_hp);
    expect(entity.ev_hp).toEqual(entityMock.ev_hp);
    expect(entity.max_hp).toEqual(entityMock.max_hp);
    expect(entity.losses).toEqual(entityMock.losses);
    expect(entity.battles).toEqual(entityMock.battles);
    expect(entity.pokemon).toEqual(entityMock.pokemon);
    expect(entity.iv_speed).toEqual(entityMock.iv_speed);
    expect(entity.ev_speed).toEqual(entityMock.ev_speed);
    expect(entity.iv_attack).toEqual(entityMock.iv_attack);
    expect(entity.ev_attack).toEqual(entityMock.ev_attack);
    expect(entity.iv_defense).toEqual(entityMock.iv_defense);
    expect(entity.ev_defense).toEqual(entityMock.ev_defense);
    expect(entity.created_at).toEqual(entityMock.created_at);
    expect(entity.updated_at).toEqual(entityMock.updated_at);
    expect(entity.deleted_at).toBe(entityMock.deleted_at);
    expect(entity.discovered).toBeFalsy();
    expect(entity.pokemon_name).toEqual(entityMock.pokemon.name);
    expect(entity.pokemon_trainer).toBe(entityMock.pokemon_trainer);
    expect(entity.iv_special_attack).toBe(entityMock.iv_special_attack);
    expect(entity.ev_special_attack).toBe(entityMock.ev_special_attack);
    expect(entity.iv_special_defense).toBe(entityMock.iv_special_defense);
    expect(entity.ev_special_defense).toBe(entityMock.ev_special_defense);
  });

  it('should create an instance with some provided parameters', () => {
    const entity = new Pokedex({
      ...entityMock,
      hp: undefined,
      wins: undefined,
      level: undefined,
      iv_hp: undefined,
      ev_hp: undefined,
      max_hp: undefined,
      losses: undefined,
      battles: undefined,
      iv_speed: undefined,
      ev_speed: undefined,
      iv_attack: undefined,
      ev_attack: undefined,
      iv_defense: undefined,
      ev_defense: undefined,
      experience: undefined,
      discovered: true,
      created_at: undefined,
      updated_at: undefined,
      deleted_at: undefined,
      iv_special_attack: undefined,
      ev_special_attack: undefined,
      iv_special_defense: undefined,
      ev_special_defense: undefined,
    });
    expect(entity).toBeInstanceOf(Pokedex);
    expect(entity.id).toEqual(entityMock.id);
    expect(entity.hp).toEqual(0);
    expect(entity.wins).toEqual(0);
    expect(entity.level).toEqual(1);
    expect(entity.iv_hp).toEqual(0);
    expect(entity.ev_hp).toEqual(0);
    expect(entity.max_hp).toEqual(0);
    expect(entity.losses).toEqual(0);
    expect(entity.battles).toEqual(0)
    expect(entity.pokemon).toEqual(entityMock.pokemon);
    expect(entity.iv_speed).toEqual(0);
    expect(entity.ev_speed).toEqual(0);
    expect(entity.iv_attack).toEqual(0);
    expect(entity.ev_attack).toEqual(0);
    expect(entity.iv_defense).toEqual(0);
    expect(entity.ev_defense).toEqual(0);
    expect(entity.experience).toEqual(0);
    expect(entity.created_at).toBeUndefined();
    expect(entity.updated_at).toBeUndefined();
    expect(entity.deleted_at).toBeUndefined();
    expect(entity.discovered).toBeTruthy();
    expect(entity.pokemon_name).toEqual(entityMock.pokemon.name);
    expect(entity.pokemon_trainer).toBe(entityMock.pokemon_trainer);
    expect(entity.iv_special_attack).toEqual(0);
    expect(entity.ev_special_attack).toEqual(0);
    expect(entity.iv_special_defense).toEqual(0);
    expect(entity.ev_special_defense).toEqual(0);
  });
});