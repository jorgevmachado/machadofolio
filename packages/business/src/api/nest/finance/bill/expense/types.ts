import { type EMonth } from '@repo/services/date/month/enum';

import type { IFinanceBase } from '../../types';

import { type ISupplier } from '../../supplier';

import type { IBill } from '../types';

import { type EExpenseType } from './enum';

export type IExpense = IFinanceBase & {
    year?: number;
    bill: IBill;
    type: EExpenseType;
    paid?: boolean;
    value?: number;
    total?: number;
    month?: EMonth;
    supplier: ISupplier;
    total_paid?: number;
    january?: number;
    january_paid?: boolean;
    february?: number;
    february_paid?: boolean;
    march?: number;
    march_paid?: boolean;
    april?: number;
    april_paid?: boolean;
    may?: number;
    may_paid?: boolean;
    june?: number;
    june_paid?: boolean;
    july?: number;
    july_paid?: boolean;
    august?: number;
    august_paid?: boolean;
    september?: number;
    september_paid?: boolean;
    october?: number;
    october_paid?: boolean;
    november?: number;
    november_paid?: boolean;
    december?: number;
    december_paid?: boolean;
    description?: string;
    instalment_number?: number;
}

export type ICreateExpenseParams = {
    type: EExpenseType;
    paid?: boolean;
    value?: number;
    month?: EMonth;
    supplier: string | IExpense['supplier'];
    description?: string;
    instalment_number?: number;
}

export type IUpdateExpenseParams = Omit<
        IExpense,
        | 'id'
        | 'bill'
        | 'type'
        | 'name'
        | 'value'
        | 'supplier'
        | 'name_code'
        | 'created_at'
        | 'updated_at'
        | 'deleted_at'
        | 'instalment_number'
    > & {
    bill?: string | IExpense['bill'];
    type?: IExpense['type'];
    supplier?: string | IExpense['supplier'];
}
