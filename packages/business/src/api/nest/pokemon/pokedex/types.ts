import type { IBaseEntity } from '../../../types';

import type { ITrainer } from '../trainer';
import type { IPokemon } from '../types';

export type IPokedex = IBaseEntity & {
  hp: number;
  wins: number;
  level: number;
  iv_hp: number;
  ev_hp: number;
  losses: number;
  max_hp: number;
  battles: number;
  pokemon: IPokemon;
  iv_speed: number;
  ev_speed: number;
  iv_attack: number;
  ev_attack: number;
  iv_defense: number;
  ev_defense: number;
  experience: number;
  discovered: boolean;
  pokemon_name: string;
  pokemon_trainer: ITrainer
  iv_special_attack: number;
  ev_special_attack: number;
  iv_special_defense: number;
  ev_special_defense: number;
}