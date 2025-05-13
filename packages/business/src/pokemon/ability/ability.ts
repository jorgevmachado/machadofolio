import type { AbilityConstructorParams, AbilityEntity } from './types';

export default class Ability implements AbilityEntity {
    id!: AbilityEntity['id'];
    url!: AbilityEntity['url'];
    slot!: AbilityEntity['slot'];
    name!: AbilityEntity['name'];
    order!: AbilityEntity['order'];
    is_hidden!: AbilityEntity['is_hidden'];
    created_at!: AbilityEntity['created_at'];
    updated_at!: AbilityEntity['updated_at'];
    deleted_at?: AbilityEntity['deleted_at'];

    constructor(params?: AbilityConstructorParams) {
        this.id =  params?.id ?? this.id;
        this.url =  params?.url ?? this.url;
        this.slot =  params?.slot ?? this.slot;
        this.name =  params?.name ?? this.name;
        this.order =  params?.order ?? this.order;
        this.is_hidden =  params?.is_hidden ?? this.is_hidden;
        this.created_at =  params?.created_at ?? this.created_at;
        this.updated_at =  params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;
    }
}