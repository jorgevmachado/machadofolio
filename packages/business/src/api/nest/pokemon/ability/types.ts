import type { IPokemonBase } from '../types';

export type IAbility = IPokemonBase & {
    slot: number;
    is_hidden: boolean;
}