import type { IFinanceBase } from '../types';

export type IGroup = IFinanceBase;

export type ICreateGroupParams = Pick<IGroup, 'name'>;

export type IUpdateGroupParams = ICreateGroupParams;