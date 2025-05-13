import { type EStatus } from '../../enum';

import { type INestBaseEntity } from '../types';

import { type IAbility } from './ability';
import { type IMove } from './move';
import { type IType } from './type';

export type IPokemonBase = INestBaseEntity & {
    url: string;
    name: string;
    order: number;
}

export type IPokemon = IPokemonBase & {
    hp?: number;
    image?: string;
    speed?: string;
    moves?: Array<IMove>;
    types?: Array<IType>;
    status: EStatus;
    attack?: number;
    defense?: number;
    habitat?: string;
    is_baby?: boolean;
    shape_url?: string;
    abilities?: Array<IAbility>;
    evolutions?: Array<IPokemon>;
    shape_name?: string;
    is_mythical?: boolean;
    gender_rate?: number;
    is_legendary?: boolean;
    capture_rate?: number;
    hatch_counter?: number;
    base_happiness?: number;
    special_attack?: number;
    special_defense?: number;
    evolution_chain_url?: string;
    evolves_from_species?: string;
    has_gender_differences?: boolean;
};