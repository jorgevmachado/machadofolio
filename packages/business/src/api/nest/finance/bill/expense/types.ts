import { type EMonth, ReplaceWordParam } from '@repo/services';

import type { IFinanceBase } from '../../types';

import type { IMonth, IPersistMonthParams } from '../../month';
import type { ISupplier } from '../../supplier';

import type { IBill } from '../types';

import type { EExpenseType } from './enum';

export type IExpenseBase = IFinanceBase & {
    year: number;
    bill: IBill;
    type: EExpenseType;
    paid: boolean;
    value?: number;
    total: number;
    month?: EMonth;
    supplier: ISupplier;
    total_paid: number;
    description?: string;
    total_pending?: number;
    instalment_number: number;
};

export type IExpense = IFinanceBase & IExpenseBase & {
    parent?: IExpense;
    months?: Array<IMonth>;
    children?: Array<IExpense>;
    is_aggregate?: boolean;
    aggregate_name?: string;
};

export type ICreateExpenseParams = {
    type: EExpenseType;
    paid?: boolean;
    value?: number;
    month?: EMonth;
    months?: Array<IPersistMonthParams>;
    parent?: string | IExpense['parent'];
    supplier: string | IExpense['supplier'];
    description?: string;
    received_at?: Date;
    aggregate_name?: string;
    instalment_number?: number;
}

export type IUpdateExpenseParams = {
    paid?: boolean;
    bill?: string | IExpense['bill'];
    type?: IExpense['type'];
    months?: Array<IPersistMonthParams>;
    supplier?: string | IExpense['supplier'];
    description?: string;
}

export type IUploadsExpenseParams = {
    paid?: Array<boolean>;
    files: Array<string>;
    months: Array<EMonth>;
    replaceWords?: Array<ReplaceWordParam>;
    repeatedWords?: Array<string>;
}

export type IUploadExpenseParams = Pick<IUploadsExpenseParams, 'replaceWords' | 'repeatedWords'> & {
    file: string;
    paid?: boolean;
    month?: EMonth;
}