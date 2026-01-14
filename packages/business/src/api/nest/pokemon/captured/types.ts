import type { IBaseEntity } from '../../../types';
import type { IUser } from '../../auth';

import { type IPokemon } from '../types';

export type ICaptured = IBaseEntity & {
  user: IUser;
  pokemon: IPokemon;
  nickname?: string;
  captured_at: Date;
}