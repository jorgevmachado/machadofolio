import type { IBaseEntity } from '../../../types';

import type { ITrainer } from '../trainer';
import { type IPokemon } from '../types';

export type IPokedex = IBaseEntity & {
  pokemon: IPokemon;
  discovered: boolean;
  pokemon_trainer: ITrainer
}