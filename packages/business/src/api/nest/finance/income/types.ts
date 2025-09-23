import { EMonth } from '@repo/services';

import type { IFinance, IFinanceBase } from '../types';
import type { ICreateMonthParams, IMonth, IUpdateMonthParams } from '../month';

import type { IIncomeSource } from './source';

export type IIncome = IFinanceBase & {
    year: number;
    total: number;
    months?: Array<IMonth>;
    source: IIncomeSource;
    finance: IFinance;
    description?: string;
}

export type ICreateIncomeParams = Omit<
    IIncome,
    'id' |
    'year' |
    'total' |
    'months' |
    'source' |
    'finance' |
    'name_code' |
    'created_at' |
    'updated_at' |
    'deleted_at'
> & {
    year?: number;
    total?: number;
    month?: EMonth;
    months?: Array<ICreateMonthParams>;
    source: string | IIncome['source'];
    received_at?: Date;
};

export type IUpdateIncomeParams =
    Omit<IIncome, 'id' | 'year' | 'name' | 'total' | 'months' | 'source' | 'finance' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'>
    & {
    year?: number;
    name?: string;
    months?: Array<IUpdateMonthParams>;
    source?: string | IIncome['source'];
};