import type { PokemonByNameResponse } from '../../types';

export const MOVES_MOCK: PokemonByNameResponse['moves'] = [
    {
        move: {
            url: 'https://pokemon-mock/move/1/',
            name: 'move-1',
        },
    },
    {
        move: {
            url: 'https://pokemon-mock/move/2/',
            name: 'move-2',
        },
    },
];