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
    expect(entity.pokemon).toEqual(entityMock.pokemon);
    expect(entity.created_at).toEqual(entityMock.created_at);
    expect(entity.updated_at).toEqual(entityMock.updated_at);
    expect(entity.deleted_at).toBe(entityMock.deleted_at);
    expect(entity.discovered).toBeFalsy();
    expect(entity.pokemon_trainer).toBe(entityMock.pokemon_trainer);
  });

  it('should create an instance with some provided parameters', () => {
    const entity = new Pokedex({
      ...entityMock,
      discovered: true,
      created_at: undefined,
      updated_at: undefined,
      deleted_at: undefined,
    });
    expect(entity).toBeInstanceOf(Pokedex);
    expect(entity.id).toEqual(entityMock.id);
    expect(entity.pokemon).toEqual(entityMock.pokemon);
    expect(entity.created_at).toBeUndefined();
    expect(entity.updated_at).toBeUndefined();
    expect(entity.deleted_at).toBeUndefined();
    expect(entity.discovered).toBeTruthy();
    expect(entity.pokemon_trainer).toBe(entityMock.pokemon_trainer);
  });
});