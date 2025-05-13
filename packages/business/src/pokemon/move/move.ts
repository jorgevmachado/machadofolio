import { type MoveConstructorParams, type MoveEntity } from './types';

export default class Move implements MoveEntity {
    id!: MoveEntity['id'];
    pp!: MoveEntity['pp'];
    url!: MoveEntity['url'];
    type!: MoveEntity['type'];
    name!: MoveEntity['name'];
    order!: MoveEntity['order'];
    power?: MoveEntity['power'];
    target!: MoveEntity['target'];
    effect!: MoveEntity['effect'];
    priority!: MoveEntity['priority'];
    accuracy?: MoveEntity['accuracy'];
    short_effect!: MoveEntity['short_effect'];
    damage_class!: MoveEntity['damage_class'];
    effect_chance!: MoveEntity['effect_chance'];
    created_at!: MoveEntity['created_at'];
    updated_at!: MoveEntity['updated_at'];
    deleted_at?: MoveEntity['deleted_at'];


    constructor(params?: MoveConstructorParams) {
        this.id =  params?.id ?? this.id;
        this.pp = params?.pp ?? this.pp;
        this.url =  params?.url ?? this.url;
        this.type = params?.type ?? this.type;
        this.name =  params?.name ?? this.name;
        this.order =  params?.order ?? this.order;
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