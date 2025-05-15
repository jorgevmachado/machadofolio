import type { IPokemonResponse } from '../types';

export type IMoveResponse = {
    pp: number;
    type: IPokemonResponse;
    name: string;
    power: number;
    target: IPokemonResponse;
    priority: number;
    accuracy: number;
    damage_class: IPokemonResponse;
    effect_chance?: number;
    effect_entries: Array<{
        effect: string;
        short_effect: string;
    }>;
    learned_by_pokemon: Array<IPokemonResponse>;
}