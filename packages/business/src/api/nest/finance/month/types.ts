import { type EMonth, type TMonth } from '@repo/services';

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

export type IUpdateMonthParams = Omit<IMonth, 'year' | 'paid' | 'label'| 'created_at' | 'updated_at' | 'deleted_at'> & {
    year?: number;
    paid?: boolean;
};

export type IPersistMonthParams = Partial<Omit<IMonth, 'value'>> & {
    value: number;
    month?: EMonth;
};

export type IMonthsObject = {
    january: number;
    january_paid: boolean;
    february: number;
    february_paid: boolean;
    march: number;
    march_paid: boolean;
    april: number;
    april_paid: boolean;
    may: number;
    may_paid: boolean;
    june: number;
    june_paid: boolean;
    july: number;
    july_paid: boolean;
    august: number;
    august_paid: boolean;
    september: number;
    september_paid: boolean;
    october: number;
    october_paid: boolean;
    november: number;
    november_paid: boolean;
    december: number;
    december_paid: boolean;
}