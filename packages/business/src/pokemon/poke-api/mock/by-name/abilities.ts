import { type PokemonByNameResponse } from '../../types';

export const ABILITIES_MOCK: PokemonByNameResponse['abilities'] =  [
    {
        slot: 1,
        ability: {
            url: 'https://pokemon-mock/ability/1/',
            name: 'ability-1',
        },
        is_hidden: false,
        
    },
    {
        slot: 2,
        ability: {
            url: 'https://pokemon-mock/ability/2/',
            name: 'ability-2',
        },
        is_hidden: true,
        
    }
];