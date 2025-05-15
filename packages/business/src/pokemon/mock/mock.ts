import { EStatus } from '../../api';

import type { PokemonEntity } from '../types';

export const POKEMON_MOCK: PokemonEntity = {
    id: 'ac0138cd-4910-4000-8000-000000000000',
    hp: 0,
    url: 'http://pokemon-mock/1/',
    name: 'pokemon',
    image: 'https://pokemon-mock/pokemon/1.png',
    speed: 0,
    moves: [],
    types: [],
    order: 1,
    status: EStatus.COMPLETE,
    attack: 49,
    defense: 49,
    habitat: 'habitat',
    is_baby: false,
    shape_url: 'http://pokemon-mock/pokemon-shape/8/',
    abilities: [],
    evolutions: [],
    created_at: new Date('2025-02-06T18:26:04.618Z'),
    updated_at: new Date('2025-02-06T18:26:04.618Z'),
    deleted_at: undefined,
    shape_name: 'shape_name',
    is_mythical: false,
    gender_rate: 1,
    is_legendary: false,
    capture_rate: 45,
    hatch_counter: 20,
    base_happiness: 50,
    special_attack: 65,
    special_defense: 65,
    evolution_chain_url: 'http://pokemon-mock/evolution-chain/1/',
    evolves_from_species: undefined,
    has_gender_differences: false
};