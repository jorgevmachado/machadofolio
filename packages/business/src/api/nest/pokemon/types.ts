import { type EStatus } from '../../../enum';
import type { IBaseEntity } from '../../types';

import type { IAbility } from './ability';
import type { IGrowthRate } from './growth-rate';
import type { IMove } from './move';
import type { IType } from './type';

export type IPokemonBase = IBaseEntity & {
  url: string;
  name: string;
  order: number;
}

export type IPokemon = IPokemonBase & {
  hp?: number;
  image?: string;
  speed?: number;
  moves?: Array<IMove>;
  types?: Array<IType>;
  status: EStatus;
  height?: number;
  weight?: number;
  attack?: number;
  defense?: number;
  habitat?: string;
  is_baby?: boolean;
  shape_url?: string;
  abilities?: Array<IAbility>;
  evolutions?: Array<IPokemon>;
  shape_name?: string;
  growth_rate?: IGrowthRate;
  is_mythical?: boolean
  gender_rate?: number;
  is_legendary?: boolean;
  capture_rate?: number;
  hatch_counter?: number;
  base_happiness?: number;
  special_attack?: number;
  external_image?: string;
  base_experience?: number;
  special_defense?: number;
  evolution_chain_url?: string;
  evolves_from_species?: string;
  has_gender_differences?: boolean;
};