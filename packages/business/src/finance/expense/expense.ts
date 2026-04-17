import { normalize, toSnakeCase } from '@repo/services';

import type { ExpenseConstructorParams, ExpenseEntity } from './types';

export default class Expense implements ExpenseEntity {
    id!: ExpenseEntity['id'];
    bill!: ExpenseEntity['bill'];
    name!: ExpenseEntity['name'];
    year: ExpenseEntity['year'] = new Date().getFullYear();
    type!: ExpenseEntity['type'];
    paid: ExpenseEntity['paid'] = false;
    total: ExpenseEntity['total'] = 0;
    months?: ExpenseEntity['months'] = [];
    parent?: ExpenseEntity['parent'];
    children?: ExpenseEntity['children'];
    supplier!: ExpenseEntity['supplier'];
    name_code!: ExpenseEntity['name_code'];
    total_paid: ExpenseEntity['total_paid'] = 0;
    created_at!: ExpenseEntity['created_at'];
    updated_at!: ExpenseEntity['updated_at'];
    deleted_at?: ExpenseEntity['deleted_at'];
    description?: ExpenseEntity['description'];
    is_aggregate?: ExpenseEntity['is_aggregate'] = false;
    total_pending?: ExpenseEntity['total_pending'] = 0;
    aggregate_name?: ExpenseEntity['aggregate_name'];
    instalment_number: ExpenseEntity['instalment_number'] = 1;

    constructor(params: ExpenseConstructorParams) {
        this.id = params?.id ?? this.id;
        this.bill = params.bill;
        this.year = params?.year ?? this.year;
        this.type = params.type;
        this.paid = params?.paid ?? this.paid;
        this.total = params?.total ?? this.total;
        this.supplier = params.supplier;
        this.total_paid = params?.total_paid ?? this.total_paid;
        this.total_pending = params?.total_pending ?? this.total_pending;

        this.name = !params?.is_aggregate
            ? `${params.bill.name} ${params.supplier.name}`
            : `${params.bill.name} ${params?.aggregate_name ?? ''} ${params.supplier.name}`;

        this.aggregate_name = !params?.is_aggregate ? undefined : params?.aggregate_name;
        this.name_code = toSnakeCase(normalize(this.name));
        this.months = params?.months ?? this.months;
        this.description = params?.description ?? this.description;
        this.instalment_number =
            params?.instalment_number ?? this.instalment_number;
        this.created_at = params?.created_at ?? this.created_at;
        this.updated_at = params?.updated_at ?? this.updated_at;
        this.deleted_at = params?.deleted_at ?? this.deleted_at;

        this.is_aggregate = params?.is_aggregate ?? this.is_aggregate;
        this.parent = params?.parent ?? this.parent;
        this.children = params?.children ?? this.children;
    }
}