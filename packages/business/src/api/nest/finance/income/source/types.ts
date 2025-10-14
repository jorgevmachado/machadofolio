import { IFinanceBase } from '../../types';

export type IIncomeSource = IFinanceBase;

export type ICreateIncomeSourceParams = Pick<IFinanceBase, 'name'>;

export type IUpdateIncomeSourceParams = ICreateIncomeSourceParams;