import type { IBaseEntity } from '../../../types';

import { type ITrainer } from '../trainer';
import { type IPokemon } from '../types';

export type ICaptured = IBaseEntity & {
  level: number;
  trainer: ITrainer;
  pokemon: IPokemon;
  nickname?: string;
  captured_at?: Date;
}