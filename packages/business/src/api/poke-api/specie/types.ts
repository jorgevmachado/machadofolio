import type { IPokemonResponse } from '../types';

export type ISpecieResponse = {
    shape: IPokemonResponse;
    habitat: IPokemonResponse;
    is_baby: boolean;
    gender_rate: number;
    is_mythical: boolean;
    capture_rate: number;
    is_legendary: boolean;
    hatch_counter: number;
    base_happiness: number;
    evolution_chain: Pick<IPokemonResponse, 'url'>;
    evolves_from_species?: IPokemonResponse;
    has_gender_differences: boolean;
}