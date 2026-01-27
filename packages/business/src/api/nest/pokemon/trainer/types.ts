import { type IBaseEntity } from '../../../types';
import { type IUser } from '../../auth';

import { type ICaptured } from '../captured';
import { type IPokedex } from '../pokedex';

export type ITrainer = IBaseEntity & {
  user: IUser;
  pokedex?: Array<IPokedex>;
  capture_rate?: number;
  captured_pokemons?: Array<ICaptured>;
};