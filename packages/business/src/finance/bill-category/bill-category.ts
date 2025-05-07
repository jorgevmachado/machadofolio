import { normalize, toSnakeCase } from '@repo/services/string/string';

import type { BillCategoryConstructorParams, BillCategoryEntity } from './types';

export default class BillCategory implements BillCategoryEntity {
    id!: BillCategoryEntity['id'];
    name!: BillCategoryEntity['name'];
    name_code!: BillCategoryEntity['name_code'];
    created_at!: BillCategoryEntity['created_at'];
    updated_at!: BillCategoryEntity['updated_at'];
    deleted_at?: BillCategoryEntity['deleted_at'];

    constructor(params?: BillCategoryConstructorParams) {
        if (params) {
            this.id = params?.id ?? this.id;
            this.name = params?.name;
            this.name_code = toSnakeCase(normalize(this.name));
            this.created_at = params?.created_at ?? this.created_at;
            this.updated_at = params?.updated_at ?? this.updated_at;
            this.deleted_at = params?.deleted_at ?? this.deleted_at;
        }
    }
}