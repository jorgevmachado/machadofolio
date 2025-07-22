import { ensureOrderNumber } from '@repo/services';

import type { AbilityConstructorParams, PokemonAbilityEntity } from './types';

export default class PokemonAbility implements PokemonAbilityEntity {
    id!: PokemonAbilityEntity['id'];
    url!: PokemonAbilityEntity['url'];
    slot!: PokemonAbilityEntity['slot'];
    name!: PokemonAbilityEntity['name'];
    order: PokemonAbilityEntity['order'] = 0;
    is_hidden!: PokemonAbilityEntity['is_hidden'];
    created_at!: PokemonAbilityEntity['created_at'];
    updated_at!: PokemonAbilityEntity['updated_at'];
    deleted_at?: PokemonAbilityEntity['deleted_at'];

    constructor(params?: AbilityConstructorParams) {
        this.id =  params?.id ?? this.id;
        this.url =  params?.url ?? this.url;
        this.slot =  params?.slot ?? this.slot;
        this.name =  params?.name ?? this.name;
        this.order = ensureOrderNumber(params?.order ?? this.order, this.url);
        this.is_hidden =  params?.is_hidden ?? this.is_hidden;
        this.created_at =  params?.created_at ?? this.created_at;
        this.updated_at =  params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;
    }
}