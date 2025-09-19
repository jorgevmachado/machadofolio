import type { ICreateIncomeParams, IIncome, IPartialNestBaseEntity, IUpdateIncomeParams } from '../../api';

export type IncomeEntity = IIncome;

export type IncomeConstructorParams = Omit<
    IIncome,
    'id' |
    'year'|
    'name_code' |
    'created_at' |
    'updated_at' |
    'deleted_at'
> & IPartialNestBaseEntity & {
    year?: number;
};

export type CreateIncomeParams = ICreateIncomeParams;

export type UpdateIncomeParams = IUpdateIncomeParams;