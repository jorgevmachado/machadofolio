import { type INestBaseEntity } from '../types';
import { type IUser } from '../auth';

import { type IBank } from './bank';
import { type IBill } from './bill';
import { type IGroup } from './group';
import { type ISupplier } from './supplier';

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