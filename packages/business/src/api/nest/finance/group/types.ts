import type { IFinance, IFinanceBase } from '../types';

export type IGroup = IFinanceBase & {
    finance: IFinance;
};

export type ICreateGroupParams = Pick<IGroup, 'name'>;

export type IUpdateGroupParams = ICreateGroupParams;