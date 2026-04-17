import type { PokemonByNameResponse } from '../../types';

export const STATS_MOCK: PokemonByNameResponse['stats'] = [
    {
        base_stat: 1,
        stat: {
            url: 'https://pokemon-mock/stat/1/',
            name: 'hp',
        }
    },
    {
        base_stat: 2,
        stat: {
            url: 'https://pokemon-mock/stat/2/',
            name: 'speed',
        }
    },
    {
        base_stat: 3,
        stat: {
            url: 'https://pokemon-mock/stat/3/',
            name: 'attack',
        }
    },
    {
        base_stat: 4,
        stat: {
            url: 'https://pokemon-mock/stat/4/',
            name: 'defense',
        }
    },
    {
        base_stat: 5,
        stat: {
            url: 'https://pokemon-mock/stat/5/',
            name: 'special-attack',
        }
    },
    {
        base_stat: 6,
        stat: {
            url: 'https://pokemon-mock/stat/6/',
            name: 'special-defense',
        }
    },

];