import type { IExpenseMonth, IPartialNestBaseEntity } from '../../api';

export type ExpenseMonthEntity = IExpenseMonth;

export type ExpenseMonthConstructorParams = Omit<
    ExpenseMonthEntity,
    'id' |
    'year' |
    'paid' |
    'month' |
    'created_at' |
    'updated_at' |
    'deleted_at'
> & IPartialNestBaseEntity & {
    year?: number;
    paid?: boolean;
    month?: number | string;
};