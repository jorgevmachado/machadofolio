import { type EMonth } from '@repo/services';

import type { IMonth, IPersistMonthParams } from '../month';
import type { IFinance, IFinanceBase } from '../types';

import type { IIncomeSource } from './source';

export type IIncome = IFinanceBase & {
    year: number;
    total: number;
    months?: Array<IMonth>;
    source: IIncomeSource;
    finance: IFinance;
    all_paid?: boolean;
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
    paid?: boolean;
    year?: number;
    total?: number;
    month?: EMonth;
    months?: Array<IPersistMonthParams>;
    source: string | IIncome['source'];
    received_at?: Date;
};

export type IUpdateIncomeParams =
    Omit<IIncome, 'id' | 'year' | 'name' | 'total' | 'months' | 'source' | 'finance' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'>
    & {
    year?: number;
    name?: string;
    months?: Array<IPersistMonthParams>;
    source?: string | IIncome['source'];
};