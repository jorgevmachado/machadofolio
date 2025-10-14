import { type INestBaseEntity } from '../types';
import { type IUser } from '../auth';

import type { IBank } from './bank';
import type { IBill, IExpense } from './bill';
import type { IGroup } from './group';
import type { ISupplier, ISupplierType } from './supplier';
import type { IIncome } from './income';

export type IFinanceBase = INestBaseEntity & {
    name: string;
    name_code: string;
}

export type IFinance = Omit<IFinanceBase, 'name' | 'name_code'>  & {
    user: IUser;
    bills?: Array<IBill>;
    groups?: Array<IGroup>;
    incomes?: Array<IIncome>;
};

export type ICreateFinanceParams = Omit<IFinance, 'bills' | 'banks' | 'incomes' | 'suppliers'> & {
    bills?: Array<string | IBill>;
    banks?: Array<string | IBank>;
    incomes?: Array<string | IIncome>;
    suppliers?: Array<string | ISupplier>;
}
export type IUpdateFinanceParams = ICreateFinanceParams;

export type IFinanceInfo = {
    bills: Array<IBill>;
    total: number;
    banks: Array<IBank>;
    groups: Array<IGroup>;
    incomes: Array<IIncome>;
    finance: IFinance;
    allPaid: boolean;
    suppliers: Array<ISupplier>;
    totalPaid: number;
    expenses: Array<IExpense>;
    totalPending: number;
    supplierTypes: Array<ISupplierType>;
};