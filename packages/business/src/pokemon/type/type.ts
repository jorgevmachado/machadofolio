import { ensureOrderNumber } from '@repo/services';

import type { PokemonTypeEntity, TypeConstructorParams } from './types';


export default class PokemonType implements PokemonTypeEntity {
    id!: PokemonTypeEntity['id'];
    url!: PokemonTypeEntity['url'];
    name!: PokemonTypeEntity['name'];
    order: PokemonTypeEntity['order'] = 0;
    text_color: PokemonTypeEntity['text_color'] = '#FFF';
    created_at!: PokemonTypeEntity['created_at'];
    updated_at!: PokemonTypeEntity['updated_at'];
    deleted_at?: PokemonTypeEntity['deleted_at'];
    background_color: PokemonTypeEntity['background_color'] = '#000';

    constructor(params?: TypeConstructorParams) {
        this.id =  params?.id ?? this.id;
        this.url =  params?.url ?? this.url;
        this.name =  params?.name ?? this.name;
        this.order = ensureOrderNumber(params?.order ?? this.order, this.url);
        this.text_color = params?.text_color ?? this.text_color;
        this.created_at =  params?.created_at ?? this.created_at;
        this.updated_at =  params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;
        this.background_color = params?.background_color ?? this.background_color;
    }
}