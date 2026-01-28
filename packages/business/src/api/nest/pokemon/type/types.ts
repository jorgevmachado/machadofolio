import type { IPokemonBase } from '../types';

export type IType = IPokemonBase & {
    text_color: string;
    weaknesses: Array<IType>;
    background_color: string;
}