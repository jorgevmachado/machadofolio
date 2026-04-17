import type { PokemonMoveEntity } from '../../move';

export type BattleWinner = 'DRAW' | 'TRAINER' | 'WILD';

export type BattleResult = {
  level: number;
  winner: BattleWinner;
  experience: number;
  wild_pokemon_hp: number;
  trainer_pokemon_hp: number,
  wild_pokemon_damage: number;
  trainer_pokemon_damage: number;
}

export type CalculateTrainerDamageParams = {
  level: number;
  power?: number;
  attack?: number;
  defense?: number;
  iv_attack: number;
  ev_attack: number;
  iv_defense: number;
  ev_defense: number;
}

export type CalculateWildPokemonDamageParams = {
  level: number;
  moves?: Array<PokemonMoveEntity>;
  attack?: number;
  defense?: number;
}

export type IncreaseAttributesParams = {
  hp: number;
  level: number;
  speed: number;
  attack: number;
  defense: number;
  formula?: string;
  experience: number;
  special_attack: number;
  base_experience: number;
  special_defense: number;
}

export type IncreaseAttributesResult = Omit<IncreaseAttributesParams, 'formula' | 'base_experience'>;