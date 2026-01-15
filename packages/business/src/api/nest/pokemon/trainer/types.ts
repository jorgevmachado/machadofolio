import { type IBaseEntity } from '../../../types';
import { type IUser } from '../../auth';

import { type IPokemon } from '../types';

export type ITrainer = IBaseEntity & {
  user: IUser;
  capture_rate?: number;
  captured_pokemons?: Array<IPokemon>;
};