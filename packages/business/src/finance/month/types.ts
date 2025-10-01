import type {
    IMonth,
    IPartialNestBaseEntity,
    ICreateMonthParams,
    IUpdateMonthParams,
    IPersistMonthParams
} from '../../api';

export type MonthEntity = IMonth;

export type MonthConstructorParams = Omit<
    MonthEntity,
    'id' |
    'year' |
    'paid' |
    'code' |
    'label' |
    'created_at' |
    'updated_at' |
    'deleted_at'
> & IPartialNestBaseEntity & {
    year?: number;
    paid?: boolean;
    code?: number;
    month?: number | string;
};

export type CreateMonthParams = ICreateMonthParams;
export type UpdateMonthParams = IUpdateMonthParams;
export type PersistMonthParams = IPersistMonthParams;