import type { IFinanceBase } from '../types';

export type IBillCategory = IFinanceBase;

export type ICreateBillCategoryParams = Pick<IBillCategory, 'name'>;

export type IUpdateBillCategoryParams = ICreateBillCategoryParams;