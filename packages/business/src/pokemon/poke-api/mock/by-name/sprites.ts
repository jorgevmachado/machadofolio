import type { PokemonByNameResponse } from '../../types';

export const SPRITES_MOCK: PokemonByNameResponse['sprites'] = {
    front_default: 'https://pokemon-mock/front/1.png',
    other: {
        dream_world: {
            back_gray: undefined,
            front_gray: undefined,
            back_shiny: undefined,
            front_shiny: undefined,
            back_female: undefined,
            front_female: undefined,
            back_default: undefined,
            front_default: undefined,
            back_transparent: undefined,
            front_transparent: undefined,
            back_shiny_female: undefined,
            front_shiny_female: undefined,
            back_shiny_transparent: undefined,
            front_shiny_transparent: undefined,
        }
    }
};