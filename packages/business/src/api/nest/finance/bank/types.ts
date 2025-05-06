import type { IFinanceBase } from '../types';

export type IBank = IFinanceBase;

export type ICreateBankParams = Pick<IBank, 'name'>;

export type IUpdateBankParams = ICreateBankParams;