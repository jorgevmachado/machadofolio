import type { IPokemonBase } from '../types';

export type IMove = IPokemonBase & {
    pp: number;
    type: string;
    power?: number;
    target: string;
    effect: string;
    priority: number;
    accuracy?: number;
    short_effect: string;
    damage_class: string;
    effect_chance?: number;
}