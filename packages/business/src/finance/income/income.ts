import { normalize, toSnakeCase } from '@repo/services';

import type { IncomeConstructorParams, IncomeEntity } from './types';

export default class Income implements IncomeEntity {
    id!: IncomeEntity['id'];
    year: IncomeEntity['year'] = new Date().getFullYear();
    name!: IncomeEntity['name'];
    total: IncomeEntity['total'];
    months?: IncomeEntity['months'] = [];
    source: IncomeEntity['source'];
    finance!: IncomeEntity['finance'];
    all_paid?: IncomeEntity['all_paid'] = false;
    name_code!: IncomeEntity['name_code'];
    created_at!: IncomeEntity['created_at'];
    updated_at!: IncomeEntity['updated_at'];
    deleted_at?: IncomeEntity['deleted_at'];
    description?: IncomeEntity['description'];

    constructor(params?: IncomeConstructorParams) {
        if (params) {
            this.id = params?.id ?? this.id;
            this.year = params?.year ?? this.year;
            this.name = params?.name;
            this.total = params?.total;
            this.months = params?.months ?? this.months;
            this.source = params?.source;
            this.finance = params?.finance;
            this.all_paid = params?.all_paid ?? this.all_paid;
            this.name_code = toSnakeCase(normalize(this.name));
            this.created_at = params?.created_at ?? this.created_at;
            this.updated_at = params?.updated_at ?? this.updated_at;
            this.deleted_at = params?.deleted_at ?? this.deleted_at;
            this.description = params?.description ?? this.description;
        }
    }
}