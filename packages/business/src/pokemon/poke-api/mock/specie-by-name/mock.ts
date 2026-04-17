import type { PokemonSpecieResponse } from '../../types';

export const  SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK: PokemonSpecieResponse = {
    shape: {
        url: 'https://pokemon-mock/pokemon-shape/1/',
        name: 'shape-name',
    },
    habitat: {
        url: 'https://pokemon-mock/pokemon-habitat/1/',
        name: 'habitat-name',
    },
    is_baby: false,
    gender_rate: 1,
    is_mythical: false,
    capture_rate: 2,
    is_legendary: false,
    hatch_counter: 3,
    base_happiness: 4,
    evolution_chain: {
        url: 'https://pokemon-mock/evolution-chain/1/'
    },
    evolves_from_species: {
        url: 'https://pokemon-mock/evolves-from-specie/1',
        name: 'evolves-from-specie-name'
    },
    has_gender_differences: false,
};