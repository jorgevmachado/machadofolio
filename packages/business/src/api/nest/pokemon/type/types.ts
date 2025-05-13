import type { IPokemonBase } from '../types';

export type IType = IPokemonBase & {
    text_color: string;
    background_color: string;
}