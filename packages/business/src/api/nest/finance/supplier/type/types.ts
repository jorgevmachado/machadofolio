import type { IFinanceBase } from '../../types';

export type ISupplierType = IFinanceBase;

export type ICreateSupplierTypeParams = Pick<IFinanceBase, 'name'>;

export type IUpdateSupplierTypeParams = ICreateSupplierTypeParams;