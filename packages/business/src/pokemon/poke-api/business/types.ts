import type Pokemon from '../../pokemon';

import type { PokemonByNameResponse } from '../types';

export type EnsureImageParams = {
    image?: string;
    sprites?: PokemonByNameResponse['sprites'];
}

export type EnsureSpecieAttributesResult = Pick<Pokemon,
    'habitat' |
    'is_baby' |
    'shape_url' |
    'shape_name' |
    'is_mythical' |
    'gender_rate' |
    'is_legendary' |
    'capture_rate' |
    'hatch_counter' |
    'base_happiness' |
    'evolution_chain_url' |
    'evolves_from_species' |
    'has_gender_differences'
>