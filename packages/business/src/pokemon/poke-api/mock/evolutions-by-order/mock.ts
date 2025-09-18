export const ORIGINAL_EVOLUTION_POKEMON_MOCK = {
    url: 'https://pokemon-mock/pokemon-species/1/',
    name: 'pokemon-original',

};

export const FIRST_EVOLUTION_POKEMON_MOCK = {
    url: 'https://pokemon-mock/pokemon-species/2/',
    name: 'pokemon-first-evolution',

};

export const SECOND_EVOLUTION_POKEMON_MOCK = {
    url: 'https://pokemon-mock/pokemon-species/3/',
    name: 'pokemon-second-evolution',

};

const EVOLUTIONS_MOCK = {
    evolves_to: [
        {
            species: SECOND_EVOLUTION_POKEMON_MOCK,
            evolves_to: [],

        }
    ],
    species: FIRST_EVOLUTION_POKEMON_MOCK
};

export const EVOLUTION_RESPONSE_MOCK = {
    chain: {
        species: ORIGINAL_EVOLUTION_POKEMON_MOCK,
        evolves_to: [ EVOLUTIONS_MOCK ],
    },
};