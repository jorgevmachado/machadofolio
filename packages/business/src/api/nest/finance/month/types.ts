import { EMonth, TMonth } from '@repo/services';

import type { INestBaseEntity } from '../../types';
import type { IExpense } from '../bill';
import type { IIncome } from '../income';

export type IMonth = INestBaseEntity  & {
    year: number;
    code: number;
    paid: boolean;
    value: number;
    label: TMonth;
    income?: IIncome;
    expense?: IExpense;
    received_at?: Date;
}

export type ICreateMonthParams = Omit<IMonth, 'id' | 'year' | 'paid' | 'code' | 'label' | 'created_at' | 'updated_at' | 'deleted_at'> & {
    year?: number;
    paid?: boolean;
    month?: EMonth;
};

export type IUpdateMonthParams = Omit<IMonth, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;