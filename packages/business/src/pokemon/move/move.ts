import { ensureOrderNumber } from '@repo/services/number/number';

import { type MoveConstructorParams, type PokemonMoveEntity } from './types';

export default class PokemonMove implements PokemonMoveEntity {
    id!: PokemonMoveEntity['id'];
    pp: PokemonMoveEntity['pp'] = 0;
    url!: PokemonMoveEntity['url'];
    type!: PokemonMoveEntity['type'];
    name!: PokemonMoveEntity['name'];
    order!: PokemonMoveEntity['order'];
    power?: PokemonMoveEntity['power'] = 0;
    target!: PokemonMoveEntity['target'];
    effect!: PokemonMoveEntity['effect'];
    priority: PokemonMoveEntity['priority'] = 0;
    accuracy?: PokemonMoveEntity['accuracy'] = 0;
    short_effect!: PokemonMoveEntity['short_effect'];
    damage_class!: PokemonMoveEntity['damage_class'];
    effect_chance?: PokemonMoveEntity['effect_chance'] = 0;
    created_at!: PokemonMoveEntity['created_at'];
    updated_at!: PokemonMoveEntity['updated_at'];
    deleted_at?: PokemonMoveEntity['deleted_at'];


    constructor(params?: MoveConstructorParams) {
        this.id =  params?.id ?? this.id;
        this.pp = params?.pp ?? this.pp;
        this.url =  params?.url ?? this.url;
        this.type = params?.type ?? this.type;
        this.name =  params?.name ?? this.name;
        this.order = ensureOrderNumber(params?.order ?? this.order, this.url);
        this.power = params?.power ?? this.power;
        this.target = params?.target ?? this.target;
        this.effect = params?.effect ?? this.effect;
        this.priority = params?.priority ?? this.priority;
        this.accuracy = params?.accuracy ?? this.accuracy;
        this.short_effect = params?.short_effect ?? this.short_effect;
        this.damage_class = params?.damage_class ?? this.damage_class;
        this.effect_chance = params?.effect_chance ?? this.effect_chance;
        this.created_at =  params?.created_at ?? this.created_at;
        this.updated_at =  params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;
    }
}