import type { IFinance, IFinanceBase } from '../types';
import { type EBillType } from './enum';
import { type IBank } from '../bank';
import { type IBillCategory } from './category';
import { type IExpense } from './expense';

export type IBill = IFinanceBase & {
    year: number;
    type: EBillType;
    bank: IBank;
    total?: number;
    finance: IFinance;
    category: IBillCategory;
    expenses?: Array<IExpense>;
    all_paid?: boolean;
    total_paid?: number;
}

export type ICreateBillParams = Omit<
        IBill,
        | 'id'
        | 'name'
        | 'bank'
        | 'year'
        | 'finance'
        | 'category'
        | 'expenses'
        | 'name_code'
        | 'created_at'
        | 'updated_at'
        | 'deleted_at'
    > & {
    year?: number;
    bank: string | IBank;
    category: string | IBillCategory;
    expenses?: Array<string | IExpense>;
}

export type IUpdateBillParams = ICreateBillParams;