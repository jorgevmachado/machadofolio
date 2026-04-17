const mockGenerateInitialIvs = jest.fn();
jest.mock('@repo/services' ,() => {
  const originalModule = jest.requireActual(
    '@repo/services') as Record<string ,any>;
  return {
    ...originalModule ,
    generateInitialIvs: mockGenerateInitialIvs,
    calculateWithFormula: jest.fn(),
  };
});

import { PokemonBattleBusiness } from './battle';
import {
  afterEach ,
  beforeEach ,
  describe ,
  expect ,
  it ,
  jest ,
} from '@jest/globals';
import PokemonBusiness from './business';
import { POKEMON_MOCK } from '../mock';
import Pokemon from '../pokemon';

jest.mock('./battle', () => {
  class PokemonBattleBusinessMock {
    increaseAttributes = jest.fn().mockReturnValue({
      level: 6,
      hp: 30,
      speed: 31,
      attack: 32,
      defense: 33,
      experience: 200,
      special_attack: 34,
      special_defense: 35,
    });
  }

  return { PokemonBattleBusiness: PokemonBattleBusinessMock }
});

describe('Pokemon Business', () => {
  let business: PokemonBusiness;
  const pokemonEntity = POKEMON_MOCK as unknown as Pokemon;
  const mockPokemons: Array<Pokemon> = [pokemonEntity];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    business = new PokemonBusiness();
    mockGenerateInitialIvs.mockImplementation(() => 42);
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('PokemonBattleBusiness', () => {
    it('should return the instance of PokemonBattleBusiness via battler getter', () => {
      expect(business.battle).toBeInstanceOf(PokemonBattleBusiness);
    });
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

  describe('calculateMaxHp', () => {
    it('should calculate max HP with typical values', () => {
      const result = business.calculateMaxHp(45, 10, 20, 5);
      expect(result).toBe(Math.floor(((2 * 45 + 10 + Math.floor(20 / 4)) * 5) / 100) + 5 + 10);
    });

    it('should calculate max HP with all zeros', () => {
      const result = business.calculateMaxHp(0, 0, 0, 0);
      expect(result).toBe(10);
    });

    it('should calculate max HP with high values', () => {
      const result = business.calculateMaxHp(200, 31, 252, 100);
      expect(result).toBe(Math.floor(((2 * 200 + 31 + Math.floor(252 / 4)) * 100) / 100) + 100 + 10);
    });

    it('should calculate max HP with minimum level', () => {
      const result = business.calculateMaxHp(50, 5, 0, 1);
      expect(result).toBe(Math.floor(((2 * 50 + 5 + Math.floor(0 / 4)) * 1) / 100) + 1 + 10);
    });

    it('should calculate max HP with ev_hp not divisible by 4', () => {
      const result = business.calculateMaxHp(60, 12, 7, 10);
      expect(result).toBe(Math.floor(((2 * 60 + 12 + Math.floor(7 / 4)) * 10) / 100) + 10 + 10);
    });
  });

  describe('calculateStats', () => {
    it('should initialize IVs and EVs with provided values', () => {
      const result = business.calculateStats({
        hp: 50,
        iv_hp: 10,
        ev_hp: 20,
        level: 5,
        max_hp: 0,
        iv_speed: 11,
        ev_speed: 21,
        iv_attack: 12,
        ev_attack: 22,
        iv_defense: 13,
        ev_defense: 23,
        experience: 100,
        iv_special_attack: 14,
        ev_special_attack: 24,
        iv_special_defense: 15,
        ev_special_defense: 25,
        pokemon: { ...pokemonEntity, hp: 45 },
      });

      expect(result.iv_hp).toBe(10);
      expect(result.ev_hp).toBe(20);
      expect(result.iv_speed).toBe(11);
      expect(result.ev_speed).toBe(21);
      expect(result.iv_attack).toBe(12);
      expect(result.ev_attack).toBe(22);
      expect(result.iv_defense).toBe(13);
      expect(result.ev_defense).toBe(23);
      expect(result.iv_special_attack).toBe(14);
      expect(result.ev_special_attack).toBe(24);
      expect(result.iv_special_defense).toBe(15);
      expect(result.ev_special_defense).toBe(25);
    });

    it('should generate IVs and EVs if values are zero', () => {
      const result = business.calculateStats({
        hp: 0,
        iv_hp: 0,
        ev_hp: 0,
        level: 10,
        max_hp: 0,
        iv_speed: 0,
        ev_speed: 0,
        iv_attack: 0,
        ev_attack: 0,
        iv_defense: 0,
        ev_defense: 0,
        experience: 0,
        iv_special_attack: 0,
        ev_special_attack: 0,
        iv_special_defense: 0,
        ev_special_defense: 0,
        pokemon: { ...pokemonEntity, hp: 30 },
      });

      expect(result.iv_hp).toBe(42);
      expect(result.ev_hp).toBe(42);
      expect(result.iv_speed).toBe(42);
      expect(result.ev_speed).toBe(42);
      expect(result.iv_attack).toBe(42);
      expect(result.ev_attack).toBe(42);
      expect(result.iv_defense).toBe(42);
      expect(result.ev_defense).toBe(42);
      expect(result.iv_special_attack).toBe(42);
      expect(result.ev_special_attack).toBe(42);
      expect(result.iv_special_defense).toBe(42);
      expect(result.ev_special_defense).toBe(42);
    });

    it('should calculate max_hp and hp if values are zero', () => {
      const result = business.calculateStats({
        hp: 0,
        iv_hp: 10,
        ev_hp: 20,
        level: 5,
        max_hp: 0,
        iv_speed: 10,
        ev_speed: 20,
        iv_attack: 10,
        ev_attack: 20,
        iv_defense: 10,
        ev_defense: 20,
        experience: 0,
        iv_special_attack: 10,
        ev_special_attack: 20,
        iv_special_defense: 10,
        ev_special_defense: 20,
        pokemon: { ...pokemonEntity, hp: 45 },
      });

      const expectedMaxHp = business.calculateMaxHp(45, 10, 20, 5);
      expect(result.max_hp).toBe(expectedMaxHp);
      expect(result.hp).toBe(expectedMaxHp);
    });

    it('should keep max_hp and hp if values are not zero', () => {
      const result = business.calculateStats({
        hp: 99,
        iv_hp: 10,
        ev_hp: 20,
        level: 5,
        max_hp: 88,
        iv_speed: 10,
        ev_speed: 20,
        iv_attack: 10,
        ev_attack: 20,
        iv_defense: 10,
        ev_defense: 20,
        experience: 0,
        iv_special_attack: 10,
        ev_special_attack: 20,
        iv_special_defense: 10,
        ev_special_defense: 20,
        pokemon: { ...pokemonEntity, hp: 45 },
      });

      expect(result.max_hp).toBe(88);
      expect(result.hp).toBe(99);
    });

    it('should update stats after battle if battle is true', () => {
      business['battleBusiness'].increaseAttributes = jest.fn().
      mockReturnValue({
        level: 6 ,
        hp: 30 ,
        speed: 31 ,
        attack: 32 ,
        defense: 33 ,
        experience: 200 ,
        special_attack: 34 ,
        special_defense: 35 ,
      }) as jest.MockedFunction<typeof business['battleBusiness']['increaseAttributes']>;

      const result = business.calculateStats({
        hp: 10,
        iv_hp: 1,
        ev_hp: 2,
        level: 5,
        max_hp: 0,
        iv_speed: 3,
        ev_speed: 4,
        iv_attack: 5,
        ev_attack: 6,
        iv_defense: 7,
        ev_defense: 8,
        experience: 100,
        iv_special_attack: 9,
        ev_special_attack: 10,
        iv_special_defense: 11,
        ev_special_defense: 12,
        battle: true,
        pokemon: { ...pokemonEntity, hp: 20, base_experience: 50 },
      });

      expect(result.level).toBe(6);
      expect(result.ev_hp).toBe(30);
      expect(result.ev_speed).toBe(31);
      expect(result.ev_attack).toBe(32);
      expect(result.ev_defense).toBe(33);
      expect(result.experience).toBe(200);
      expect(result.ev_special_attack).toBe(34);
      expect(result.ev_special_defense).toBe(35);
    });
  });
});