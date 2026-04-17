import { normalize, toSnakeCase } from '@repo/services';

import type { IncomeSourceConstructorParams, IncomeSourceEntity } from './types';

export default class IncomeSource implements  IncomeSourceEntity {
    id!: IncomeSourceEntity['id'];
    name!: IncomeSourceEntity['name'];
    name_code!: IncomeSourceEntity['name_code'];
    created_at!: IncomeSourceEntity['created_at'];
    updated_at!: IncomeSourceEntity['updated_at'];
    deleted_at?: IncomeSourceEntity['deleted_at'];

    constructor(params?: IncomeSourceConstructorParams) {
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