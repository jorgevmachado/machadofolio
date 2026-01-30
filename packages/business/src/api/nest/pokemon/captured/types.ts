import type { IBaseEntity } from '../../../types';

import { type ITrainer } from '../trainer';
import { type IPokemon } from '../types';

export type ICaptured = IBaseEntity & {
  hp: number;
  wins: number;
  level: number;
  losses: number;
  max_hp: number;
  battles: number;
  trainer: ITrainer;
  pokemon: IPokemon;
  nickname?: string;
  experience: number;
  captured_at?: Date;
}