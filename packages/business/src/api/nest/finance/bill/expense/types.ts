import { type EMonth } from '@repo/services';

import type { IFinanceBase } from '../../types';

import type { IMonth } from '../../month';
import type { ISupplier } from '../../supplier';

import type { IBill } from '../types';

import type { EExpenseType } from './enum';

export type IExpenseMonthsWithPaid = {
    january: number;
    january_paid: boolean;
    february: number;
    february_paid: boolean;
    march: number;
    march_paid: boolean;
    april: number;
    april_paid: boolean;
    may: number;
    may_paid: boolean;
    june: number;
    june_paid: boolean;
    july: number;
    july_paid: boolean;
    august: number;
    august_paid: boolean;
    september: number;
    september_paid: boolean;
    october: number;
    october_paid: boolean;
    november: number;
    november_paid: boolean;
    december: number;
    december_paid: boolean;
}

export type IExpenseBase = IFinanceBase & {
    year: number;
    bill: IBill;
    type: EExpenseType;
    paid: boolean;
    value?: number;
    total: number;
    month?: EMonth;
    supplier: ISupplier;
    total_paid: number;
    description?: string;
    instalment_number: number;
};

export type IExpense = IFinanceBase & IExpenseBase & {
    parent?: IExpense;
    months?: Array<IMonth>;
    children?: Array<IExpense>;
    is_aggregate?: boolean;
    aggregate_name?: string;
};

export type ICreateExpenseParams = {
    type: EExpenseType;
    paid?: boolean;
    name?: string;
    value?: number;
    month?: EMonth;
    parent?: string | IExpense['parent'];
    supplier: string | IExpense['supplier'];
    description?: string;
    aggregate_name?: string;
    instalment_number?: number;
}

export type IUpdateExpenseParams = Partial<IExpenseMonthsWithPaid> & {
    paid?: boolean;
    bill?: string | IExpense['bill'];
    type?: IExpense['type'];
    supplier?: string | IExpense['supplier'];
    description?: string;
}