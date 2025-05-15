import type { PokemonByNameResponse } from '../../types';

export const TYPES_MOCK: PokemonByNameResponse['types'] = [
    {
        slot: 1,
        type: {
            url: 'https://pokemon-mock/type/1/',
            name: 'type-1',
        }
    },
    {
        slot: 2,
        type: {
            url: 'https://pokemon-mock/type/2/',
            name: 'type-2',
        }
    }
];