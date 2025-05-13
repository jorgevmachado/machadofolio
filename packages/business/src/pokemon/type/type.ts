import type { TypeConstructorParams, TypeEntity } from './types';


export default class Type implements TypeEntity {
    id!: TypeEntity['id'];
    url!: TypeEntity['url'];
    name!: TypeEntity['name'];
    order!: TypeEntity['order'];
    text_color!: TypeEntity['text_color'];
    created_at!: TypeEntity['created_at'];
    updated_at!: TypeEntity['updated_at'];
    deleted_at?: TypeEntity['deleted_at'];
    background_color!: TypeEntity['background_color'];

    constructor(params?: TypeConstructorParams) {
        this.id =  params?.id ?? this.id;
        this.url =  params?.url ?? this.url;
        this.name =  params?.name ?? this.name;
        this.order =  params?.order ?? this.order;
        this.text_color = params?.text_color ?? this.text_color;
        this.created_at =  params?.created_at ?? this.created_at;
        this.updated_at =  params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;
        this.background_color = params?.background_color ?? this.background_color;
    }
}