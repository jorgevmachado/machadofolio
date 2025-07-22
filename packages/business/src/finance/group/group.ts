import { normalize, toSnakeCase } from '@repo/services';

import type { GroupConstructorParams, GroupEntity } from './types';

export default class Group implements GroupEntity {
    id!: GroupEntity['id'];
    name!: GroupEntity['name'];
    finance!: GroupEntity['finance'];
    name_code!: GroupEntity['name_code'];
    created_at!: GroupEntity['created_at'];
    updated_at!: GroupEntity['updated_at'];
    deleted_at?: GroupEntity['deleted_at'];

    constructor(params?: GroupConstructorParams) {
        if (params) {
            this.id = params?.id ?? this.id;
            this.name = params?.name;
            this.finance = params?.finance ?? this.finance;
            this.name_code = toSnakeCase(normalize(this.name));
            this.created_at = params?.created_at ?? this.created_at;
            this.updated_at = params?.updated_at ?? this.updated_at;
            this.deleted_at = params?.deleted_at ?? this.deleted_at;
        }
    }
}