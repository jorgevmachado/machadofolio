import { getCurrentMonthNumber, getMonthByIndex } from '@repo/services';

import type { MonthConstructorParams, MonthEntity } from './types';

export default class Month implements MonthEntity {
    id!: MonthEntity['id'];
    year: MonthEntity['year'] = new Date().getFullYear();
    code: MonthEntity['code'] = 1;
    paid: MonthEntity['paid'] = false;
    value: MonthEntity['value'] = 0;
    label: MonthEntity['label'] = 'january';
    income?: MonthEntity['income'];
    expense?: MonthEntity['expense'];
    created_at!: MonthEntity['created_at'];
    updated_at!: MonthEntity['updated_at'];
    deleted_at?: MonthEntity['deleted_at'];
    received_at?: MonthEntity['received_at'];

    constructor(params?: MonthConstructorParams) {
        if(params) {
            this.id = params?.id ?? this.id;
            if(params?.code) {
                this.code = params?.code;
            }
            this.code = params?.month ? getCurrentMonthNumber(params?.month) : this.code;
            this.year = params?.year ?? this.year;
            this.paid = params?.paid ?? this.paid;
            this.value = params?.value;
            this.label = getMonthByIndex(this.code - 1);
            this.income = params?.income ?? this.income;
            this.expense = params?.expense ?? this.expense;
            this.created_at = params?.created_at ?? this.created_at;
            this.updated_at = params?.updated_at ?? this.updated_at;
            this.deleted_at = params?.deleted_at ?? this.deleted_at;
            this.received_at = params?.received_at ?? this.received_at;
        }
    }
}