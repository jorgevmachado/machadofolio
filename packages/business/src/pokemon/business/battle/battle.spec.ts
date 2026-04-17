const mockGetStat = jest.fn();
const mockCalculateWithFormula = jest.fn();

jest.mock('@repo/services' ,() => {
  const originalModule = jest.requireActual(
    '@repo/services') as Record<string ,any>;
  return {
    ...originalModule ,
    getStat: mockGetStat ,
    calculateWithFormula: mockCalculateWithFormula,
  };
});

import { POKEMON_MOVE_MOCK ,PokemonMoveEntity } from '../../move';

import {
  afterEach ,
  beforeEach ,
  describe ,
  expect ,
  it ,
  jest ,
} from '@jest/globals';
import PokemonBattleBusiness from './battle';

describe('Pokemon Battle Business' ,() => {
  let business: PokemonBattleBusiness;
  const pokemonMoveMock = POKEMON_MOVE_MOCK as unknown as PokemonMoveEntity;
  const mockFormula = 'x*3';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    business = new PokemonBattleBusiness();
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('calculateWinner' ,() => {
    it(
      'should return TRAINER when wildPokemonHp is 0 or less and trainerPokemonHp is greater than 0' ,
      () => {
        expect(business.calculateWinner(10 ,0)).toBe('TRAINER');
        expect(business.calculateWinner(5 ,-1)).toBe('TRAINER');
      });

    it(
      'should return WILD when trainerPokemonHp is 0 or less and wildPokemonHp is greater than 0' ,
      () => {
        expect(business.calculateWinner(0 ,10)).toBe('WILD');
        expect(business.calculateWinner(-5 ,3)).toBe('WILD');
      });

    it(
      'should return DRAW when both trainerPokemonHp and wildPokemonHp are 0 or less' ,
      () => {
        expect(business.calculateWinner(0 ,0)).toBe('DRAW');
        expect(business.calculateWinner(-1 ,-1)).toBe('DRAW');
      });

    it(
      'should return DRAW when both trainerPokemonHp and wildPokemonHp are greater than 0' ,
      () => {
        expect(business.calculateWinner(10 ,10)).toBe('DRAW');
        expect(business.calculateWinner(1 ,2)).toBe('DRAW');
      });
  });

  describe('calculateTrainerPokemonDamage' ,() => {

    it('should calculate minimum damage as 1 when formula returns less than 1' ,
      () => {
        mockGetStat.mockReturnValueOnce(1).mockReturnValueOnce(9999);
        const result = business.calculateTrainerPokemonDamage({
          level: 10 ,
          power: 40 ,
          attack: 10 ,
          defense: 10 ,
          iv_attack: 0 ,
          ev_attack: 0 ,
          iv_defense: 0 ,
          ev_defense: 0,
        });
        expect(result).toBe(1);
      });

    it('should calculate correct damage with provided stats' ,() => {
      mockGetStat.mockReturnValueOnce(50).mockReturnValueOnce(30);
      const result = business.calculateTrainerPokemonDamage({
        level: 20 ,
        power: 50 ,
        attack: 60 ,
        defense: 40 ,
        iv_attack: 10 ,
        ev_attack: 20 ,
        iv_defense: 5 ,
        ev_defense: 15,
      });
      const expected = Math.max(
        1 ,
        Math.floor((((2 * 20) / 5 + 2) * 50 * 50) / (30 * 50)),
      );
      expect(result).toBe(expected);
    });

    it('should use default power 40 if not provided' ,() => {
      mockGetStat.mockReturnValueOnce(20).mockReturnValueOnce(10);
      const result = business.calculateTrainerPokemonDamage({
        level: 5 ,
        attack: 10 ,
        defense: 5 ,
        iv_attack: 0 ,
        ev_attack: 0 ,
        iv_defense: 0 ,
        ev_defense: 0,
      });
      const expected = Math.max(
        1 ,
        Math.floor((((2 * 5) / 5 + 2) * 20 * 40) / (10 * 50)),
      );
      expect(result).toBe(expected);
    });
  });

  describe('calculateWildPokemonDamage' ,() => {
    it('should calculate damage using a random move from the moves array' ,
      () => {
        const moves = [
          { ...pokemonMoveMock ,power: 60 } ,
          { ...pokemonMoveMock ,power: 80 },
        ];
        jest.spyOn(Math ,'random').mockReturnValue(0.6); // Seleciona o segundo movimento
        const result = business.calculateWildPokemonDamage({
          moves ,
          level: 10 ,
          attack: 50 ,
          defense: 30,
        });
        const expected = Math.max(
          1 ,
          Math.floor((((2 * 10) / 5 + 2) * 50 * 80) / (30 * 50)),
        );
        expect(result).toBe(expected);
        (Math.random as jest.Mock).mockRestore();
      });

    it('should use default power 40 if moves array is empty' ,() => {
      const result = business.calculateWildPokemonDamage({
        moves: [] ,
        level: 10 ,
        attack: 50 ,
        defense: 30,
      });
      const expected = Math.max(
        1 ,
        Math.floor((((2 * 10) / 5 + 2) * 50 * 40) / (30 * 50)),
      );
      expect(result).toBe(expected);
    });

    it('should return minimum damage as 1 when formula returns less than 1' ,
      () => {
        const moves = [{ ...pokemonMoveMock ,power: 1 }];
        jest.spyOn(Math ,'random').mockReturnValue(0);
        const result = business.calculateWildPokemonDamage({
          moves ,
          level: 1 ,
          attack: 1 ,
          defense: 9999,
        });
        expect(result).toBe(1);
        (Math.random as jest.Mock).mockRestore();
      });
  });

  describe('updateEv' ,() => {
    it('should update ev value correctly without exceeding MAX_EV' ,() => {
      const ev = 250;
      const updatedEv = business.updateEv(ev);
      expect(updatedEv).toBe(251);
    });

    it('should update ev value correctly with MAX_EV' ,() => {
      const ev = 256;
      const updatedEv = business.updateEv(ev);
      expect(updatedEv).toBe(255);
    });
  });

  describe('calculateExperienceForLevel' ,() => {
    it('should calculate experience without formula' ,() => {
      mockCalculateWithFormula.mockReturnValueOnce({ value: 10 });
      const level = 10;
      const experience = business.calculateExperienceForLevel(level);
      expect(experience).toBe(10);
    });

    it('should calculate experience with formula' ,() => {
      mockCalculateWithFormula.mockReturnValueOnce({ value: 30 });
      const level = 10;
      const experience = business.calculateExperienceForLevel(level ,'x*3');
      expect(experience).toBe(30);
    });

    it('should return infinity when value not is number' ,() => {
      mockCalculateWithFormula.mockReturnValueOnce(
        { value: 'Invalid formula' });
      const level = 10;
      const experience = business.calculateExperienceForLevel(level ,'x*3');
      expect(experience).toBe(Infinity);
    });
  });

  describe('canLevelUp' ,() => {
    it(
      'should return false when experience is minus than necessary to level up' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 65 });
        const level = 1;
        const experience = 64;
        const result = business.canLevelUp(level ,experience ,mockFormula);
        expect(result).toBeFalsy();
      });

    it(
      'should return true when experience is equal than necessary to level up' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 64 });
        const level = 1;
        const experience = 64;
        const result = business.canLevelUp(level ,experience ,mockFormula);
        expect(result).toBeTruthy();
      });

    it(
      'should return true when experience is manor than necessary to level up' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 64 });
        const level = 1;
        const experience = 65;
        const result = business.canLevelUp(level ,experience ,mockFormula);
        expect(result).toBeTruthy();
      });
  });

  describe('nextLevel' ,() => {
    it(
      'Should not increase the level when there is a return of cannot level up' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 65 });
        const level = 1;
        const experience = 64;
        const result = business.nextLevel(level ,experience ,mockFormula);
        expect(result).toBe(level);
      });

    it('should increase the level when there is a return of can level up' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 65 }).
        mockReturnValueOnce({ value: 66 });
        const level = 1;
        const experience = 65;
        const result = business.nextLevel(level ,experience ,mockFormula);
        expect(result).toBe(level + 1);
      });

    it('should level up once if experience is just enough for next level' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 100 });
        mockCalculateWithFormula.mockReturnValueOnce({ value: 200 });
        const level = 5;
        const experience = 100;
        const result = business.nextLevel(level ,experience);
        expect(result).toBe(level + 1);
      });

    it(
      'should level up multiple times if experience is enough for several levels' ,
      () => {
        mockCalculateWithFormula.mockReturnValueOnce({ value: 100 })
        .mockReturnValueOnce({ value: 200 })
        .mockReturnValueOnce({ value: 300 });
        const level = 5;
        const experience = 250;
        const result = business.nextLevel(level ,experience, mockFormula);
        expect(result).toBe(level + 2);
      });

    it('should not level up if formula returns Infinity' ,() => {
      mockCalculateWithFormula.mockReturnValueOnce({ value: Infinity });
      const level = 10;
      const experience = 9999;
      const result = business.nextLevel(level ,experience ,'invalid');
      expect(result).toBe(level);
    });
  });

  describe('increaseAttributes', () => {
    it('should increase attributes and level up if experience is enough', () => {
      mockCalculateWithFormula.mockReturnValueOnce({ value: 64 }).mockReturnValueOnce({ value: 128 }).mockReturnValueOnce({ value: 256 });
      const attributes = {
        hp: 1,
        level: 1,
        speed: 1,
        attack: 1,
        defense: 1,
        formula: mockFormula,
        experience: 64,
        special_attack: 1,
        base_experience: 64,
        special_defense: 1,
      };
      const result = business.increaseAttributes(attributes);
      expect(result.hp).toBe(2);
      expect(result.level).toBe(3);
      expect(result.speed).toBe(2);
      expect(result.attack).toBe(2);
      expect(result.defense).toBe(2);
      expect(result.experience).toBe(128);
      expect(result.special_attack).toBe(2);
      expect(result.special_defense).toBe(2);
    });
  });
});