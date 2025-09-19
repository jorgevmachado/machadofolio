import type { IFinance, IFinanceBase } from '../types';

import type { IIncomeSource } from './source';

export type IIncome = IFinanceBase & {
    year: number;
    total: number;
    source: IIncomeSource;
    finance: IFinance;
    received_at: Date;
    description?: string;
}

export type ICreateIncomeParams = Omit<
    IIncome,
    'id' |
    'year' |
    'source' |
    'finance' |
    'name_code' |
    'created_at' |
    'updated_at' |
    'deleted_at'
> & {
    year?: number;
    source: string | IIncome['source'];
};

export type IUpdateIncomeParams = ICreateIncomeParams;