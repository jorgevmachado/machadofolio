import type { PokemonByNameResponse } from '../../types';

import { ABILITIES_MOCK } from './abilities';
import { MOVES_MOCK } from './moves';
import { SPRITES_MOCK } from './sprites';
import { STATS_MOCK } from './stats';
import { TYPES_MOCK } from './types';


export const POKEMON_BY_NAME_RESPONSE_MOCK: PokemonByNameResponse = {
    name: 'pokemon-1',
    order: 1,
    stats: STATS_MOCK,
    types: TYPES_MOCK,
    moves: MOVES_MOCK,
    sprites: SPRITES_MOCK,
    abilities: ABILITIES_MOCK,
};