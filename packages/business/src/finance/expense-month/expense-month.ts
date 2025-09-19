import { getCurrentMonthNumber } from '@repo/services';

import type { ExpenseMonthConstructorParams, ExpenseMonthEntity } from './types';

export default class ExpenseMonth implements ExpenseMonthEntity {
    id!: ExpenseMonthEntity['id'];
    year: ExpenseMonthEntity['year'] = new Date().getFullYear();
    paid: ExpenseMonthEntity['paid'] = false;
    value!: ExpenseMonthEntity['value'];
    month: ExpenseMonthEntity['month'] = 1;
    expense!: ExpenseMonthEntity['expense'];
    created_at!: ExpenseMonthEntity['created_at'];
    updated_at!: ExpenseMonthEntity['updated_at'];
    deleted_at?: ExpenseMonthEntity['deleted_at'];

    constructor(params?: ExpenseMonthConstructorParams) {
        if(params) {
            this.id = params?.id ?? this.id;
            this.year = params?.year ?? this.year;
            this.paid = params?.paid ?? this.paid;
            this.value = params?.value;
            this.month = params?.month ? getCurrentMonthNumber(params?.month) : this.month;
            this.expense = params?.expense;
            this.created_at = params?.created_at ?? this.created_at;
            this.updated_at = params?.updated_at ?? this.updated_at;
            this.deleted_at = params?.deleted_at ?? this.deleted_at;
        }
    }
}