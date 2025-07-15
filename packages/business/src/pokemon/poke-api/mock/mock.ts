import { EStatus } from '../../../enum';

import { type PokemonEntity } from '../../types';

import type { PokemonResponse } from '../types';

import { POKEMON_BY_NAME_RESPONSE_MOCK } from './by-name';
import { SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK } from './specie-by-name';


export const POKEMON_RESPONSE_MOCK: PokemonResponse = {
    url: 'http://pokemon-mock/1/',
    name: 'pokemon-1',
};

export const POKEMON_ENTITY_INITIAL_MOCK: PokemonEntity = {
    id: undefined,
    hp: 0,
    url: POKEMON_RESPONSE_MOCK.url,
    name: POKEMON_RESPONSE_MOCK.name,
    image: undefined,
    speed: 0,
    moves: undefined,
    types: undefined,
    order: 1,
    status: EStatus.INCOMPLETE,
    attack: 0,
    defense: 0,
    habitat: undefined,
    is_baby: false,
    shape_url: undefined,
    abilities: undefined,
    evolutions: undefined,
    created_at: undefined,
    updated_at: undefined,
    deleted_at: undefined,
    shape_name: undefined,
    is_mythical: false,
    gender_rate: 0,
    is_legendary: false,
    capture_rate: 0,
    hatch_counter: 0,
    base_happiness: 0,
    special_attack: 0,
    special_defense: 0,
    evolution_chain_url: undefined,
    evolves_from_species: undefined,
    has_gender_differences: false,
};



export const POKEMON_ENTITY_INITIAL_BY_NAME_MOCK: PokemonEntity = {
    ...POKEMON_ENTITY_INITIAL_MOCK,
    image: POKEMON_BY_NAME_RESPONSE_MOCK.sprites.front_default,
    hp: 1,
    speed: 2,
    attack: 3,
    defense: 4,
    special_attack: 5,
    special_defense: 6,
    types: POKEMON_BY_NAME_RESPONSE_MOCK.types.map((type) => ({
        id: undefined,
        url: type.type.url,
        name: type.type.name,
        order: type.slot,
        text_color: '#FFF',
        created_at: undefined,
        deleted_at: undefined,
        updated_at: undefined,
        background_color: '#000',
    })),
    moves: POKEMON_BY_NAME_RESPONSE_MOCK.moves.map((move, index) => ({
        id: undefined,
        pp: 0,
        url: move.move.url,
        type: '',
        name: move.move.name,
        order: index + 1,
        power: 0,
        target: '',
        effect: '',
        priority: 0,
        accuracy: 0,
        created_at: undefined,
        deleted_at: undefined,
        updated_at: undefined,
        damage_class: '',
        effect_chance: 0,
        short_effect: '',
    })),
    abilities: POKEMON_BY_NAME_RESPONSE_MOCK.abilities.map((ability, index) => ({
        id: undefined,
        url: ability.ability.url,
        slot: ability.slot,
        name: ability.ability.name,
        order: index + 1,
        is_hidden: ability.is_hidden,
        created_at: undefined,
        deleted_at: undefined,
        updated_at: undefined,
    })),
    habitat: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.habitat.name,
    is_baby: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.is_baby,
    shape_url: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.shape.url,
    shape_name: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.shape.name,
    is_mythical: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.is_mythical,
    gender_rate: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.gender_rate,
    is_legendary: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.is_legendary,
    capture_rate: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.capture_rate,
    hatch_counter: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.hatch_counter,
    base_happiness: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.base_happiness,
    evolution_chain_url: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.evolution_chain.url,
    evolves_from_species: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.evolves_from_species.name,
    has_gender_differences: SPECIE_POKEMON_BY_NAME_RESPONSE_MOCK.has_gender_differences,
};



