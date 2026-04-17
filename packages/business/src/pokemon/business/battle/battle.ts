import { calculateWithFormula ,getStat } from '@repo/services';

import type {
  BattleWinner ,
  CalculateTrainerDamageParams ,
  CalculateWildPokemonDamageParams ,
  IncreaseAttributesParams ,
  IncreaseAttributesResult ,
} from './types';

export default class PokemonBattleBusiness {
  public MAX_EV: number = 255;

  public calculateWinner(
    trainerPokemonHp: number ,wildPokemonHp: number): BattleWinner {
    if (trainerPokemonHp <= 0 && wildPokemonHp <= 0) {
      return 'DRAW';
    }
    if (trainerPokemonHp <= 0) {
      return 'WILD';
    }
    if (wildPokemonHp <= 0) {
      return 'TRAINER';
    }
    return 'DRAW';
  }

  public calculateTrainerPokemonDamage({
    level ,
    power = 40 ,
    attack = 0 ,
    defense = 0 ,
    iv_attack ,
    ev_attack ,
    iv_defense ,
    ev_defense ,
  }: CalculateTrainerDamageParams): number {
    const currentAttack = getStat(attack ,iv_attack ,ev_attack ,level);
    const currentDefense = getStat(defense ,iv_defense ,ev_defense ,level);
    return Math.max(
      1 ,
      Math.floor(
        (((2 * level) / 5 + 2) * currentAttack * power) /
        (currentDefense * 50) ,
      ) ,
    );
  }

  public calculateWildPokemonDamage({
    moves = [] ,
    level ,
    attack = 40 ,
    defense = 40,
  }: CalculateWildPokemonDamageParams): number {
    const randomIndex = Math.floor(Math.random() * moves.length);
    const wildPokemonMove = moves[randomIndex];
    const wildPokemonMovePower = wildPokemonMove?.power ?? 40;
    return Math.max(
      1 ,
      Math.floor(
        (((2 * level) / 5 + 2) * attack * wildPokemonMovePower) / (defense * 50),
      ),
    );
  }

  public updateEv(ev: number): number {
    return Math.min(ev + 1 ,this.MAX_EV);
  }

  public nextLevel(
    level: number ,experience: number ,formula?: string): number {
    return this.canLevelUp(level ,experience ,formula)
      ? this.nextLevel(level + 1 ,experience ,formula)
      : level;
  }

  public canLevelUp(
    level: number ,experience: number ,formula?: string): boolean {
    return experience >= this.calculateExperienceForLevel(level + 1 ,formula);
  }

  public calculateExperienceForLevel(value: number ,formula?: string): number {
    const result = calculateWithFormula(value ,formula);
    return typeof result.value === 'number' && !isNaN(result.value) ?
      result.value :
      Infinity;
  }

  public increaseAttributes({
    hp ,
    level ,
    speed ,
    attack ,
    defense ,
    formula ,
    experience ,
    special_attack ,
    base_experience ,
    special_defense ,
  }: IncreaseAttributesParams): IncreaseAttributesResult {
    const result: IncreaseAttributesResult = {
      hp: this.updateEv(hp) ,
      level ,
      speed: this.updateEv(speed) ,
      attack: this.updateEv(attack) ,
      defense: this.updateEv(defense) ,
      experience: experience + base_experience ,
      special_attack: this.updateEv(special_attack) ,
      special_defense: this.updateEv(special_defense) ,
    };
    result.level = this.nextLevel(result.level ,result.experience ,formula);
    return result;
  }
}