import { type INestBaseEntity } from '../types';
import { type IUser } from '../auth';

import { type IBank } from './bank';
import { type IBill, IExpense } from './bill';
import { type IGroup } from './group';
import { type ISupplier, ISupplierType } from './supplier';

export type IFinanceBase = INestBaseEntity & {
    name: string;
    name_code: string;
}

export type IFinance = Omit<IFinanceBase, 'name' | 'name_code'>  & {
    user: IUser;
    bills?: Array<IBill>;
    groups?: Array<IGroup>;
};

export type ICreateFinanceParams = Omit<IFinance, 'bills' | 'banks' | 'suppliers'> & {
    bills?: Array<string | IBill>;
    banks?: Array<string | IBank>;
    suppliers?: Array<string | ISupplier>;
}
export type IUpdateFinanceParams = ICreateFinanceParams;

export type IFinanceInfo = {
    bills: Array<IBill>;
    total: number;
    banks: Array<IBank>;
    groups: Array<IGroup>;
    finance: IFinance;
    allPaid: boolean;
    suppliers: Array<ISupplier>;
    totalPaid: number;
    expenses: Array<IExpense>;
    totalPending: number;
    supplierTypes: Array<ISupplierType>;
};