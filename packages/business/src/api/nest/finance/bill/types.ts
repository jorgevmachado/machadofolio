import { type ReplaceWordParam } from '@repo/services';

import { type IBank } from '../bank';
import { type IGroup } from '../group';
import type { IFinance ,IFinanceBase } from '../types';

import { type EBillType } from './enum';
import { type IExpense } from './expense';

export type IBill = IFinanceBase & {
  year: number;
  type: EBillType;
  bank: IBank;
  group: IGroup;
  total: number;
  finance: IFinance;
  expenses?: Array<IExpense>;
  all_paid: boolean;
  total_paid: number;
}

export type ICreateBillParams = Omit<
  IBill ,
  | 'id'
  | 'year'
  | 'name'
  | 'bank'
  | 'group'
  | 'total'
  | 'finance'
  | 'all_paid'
  | 'expenses'
  | 'name_code'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'total_paid'
> & {
  year?: number;
  bank: string | IBank;
  group: string | IGroup;
  expenses?: Array<string | IExpense>;
}

export type IUpdateBillParams = ICreateBillParams;

export type IUploadBillParams = {
  file: string;
  paid?: boolean;
  replaceWords?: Array<ReplaceWordParam>;
  repeatedWords?: Array<string>;
}