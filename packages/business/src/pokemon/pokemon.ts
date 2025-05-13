import { EStatus } from '../api';

import type { PokemonConstructorParams, PokemonEntity } from './types';

export default class Pokemon implements PokemonEntity {
    id!: PokemonEntity['id'];
    hp?: PokemonEntity['hp'];
    url!: PokemonEntity['url'];
    name!: PokemonEntity['name'];
    order!: PokemonEntity['order'];
    image?: PokemonEntity['image'];
    speed?: PokemonEntity['speed'];
    moves?: PokemonEntity['moves'];
    types?: PokemonEntity['types'];
    status: PokemonEntity['status'] = EStatus.INCOMPLETE;
    attack?: PokemonEntity['attack'];
    defense?: PokemonEntity['defense'];
    habitat?: PokemonEntity['habitat'];
    is_baby?: PokemonEntity['is_baby'];
    shape_url?: PokemonEntity['shape_url'];
    abilities?: PokemonEntity['abilities'];
    created_at!: PokemonEntity['created_at'];
    updated_at!: PokemonEntity['updated_at'];
    deleted_at?: PokemonEntity['deleted_at'];
    evolutions?: PokemonEntity['evolutions'];
    shape_name?: PokemonEntity['shape_name'];
    is_mythical?: PokemonEntity['is_mythical'];
    gender_rate?: PokemonEntity['gender_rate'];
    is_legendary?: PokemonEntity['is_legendary'];
    capture_rate?: PokemonEntity['capture_rate'];
    hatch_counter?: PokemonEntity['hatch_counter'];
    base_happiness?: PokemonEntity['base_happiness'];
    special_attack?: PokemonEntity['special_attack'];
    special_defense?: PokemonEntity['special_defense'];
    evolution_chain_url?: PokemonEntity['evolution_chain_url'];
    evolves_from_species?: PokemonEntity['evolves_from_species'];
    has_gender_differences?: PokemonEntity['has_gender_differences'];

    constructor(params?: PokemonConstructorParams) {
        this.id = params?.id ?? this.id;
        this.hp = params?.hp ?? this.hp;
        this.url = params?.url ?? this.url;
        this.name = params?.name ?? this.name;
        this.order = params?.order ?? this.order;
        this.image = params?.image ?? this.image;
        this.speed = params?.speed ?? this.speed;
        this.moves = params?.moves ?? this.moves;
        this.types = params?.types ?? this.types;
        this.status =params?.status ?? this.status;
        this.attack = params?.attack ?? this.attack;
        this.defense = params?.defense ?? this.defense;
        this.habitat = params?.habitat ?? this.habitat;
        this.is_baby = params?.is_baby ?? this.is_baby;
        this.shape_url = params?.shape_url ?? this.shape_url;
        this.abilities = params?.abilities ?? this.abilities;
        this.created_at = params?.created_at ?? this.created_at;
        this.updated_at = params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;
        this.evolutions = params?.evolutions ?? this.evolutions;
        this.shape_name =params?.shape_name ?? this.shape_name;
        this.is_mythical =params?.is_mythical ?? this.is_mythical;
        this.gender_rate =params?.gender_rate ?? this.gender_rate;
        this.is_legendary =params?.is_legendary ?? this.is_legendary;
        this.capture_rate =params?.capture_rate ?? this.capture_rate;
        this.hatch_counter =params?.hatch_counter ?? this.hatch_counter;
        this.base_happiness =params?.base_happiness ?? this.base_happiness;
        this.special_attack =params?.special_attack ?? this.special_attack;
        this.special_defense =params?.special_defense ?? this.special_defense;
        this.evolution_chain_url =params?.evolution_chain_url ?? this.evolution_chain_url;
        this.evolves_from_species = params?.evolves_from_species ?? this.evolves_from_species;
        this.has_gender_differences = params?.has_gender_differences ?? this.has_gender_differences;
    }
}