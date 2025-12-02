import type {
    ICreateIncomeSourceParams,
    IIncomeSource,
    IPartialNestBaseEntity,
    IUpdateIncomeSourceParams,
} from '../../api';

export type IncomeSourceEntity = IIncomeSource;

export type IncomeSourceConstructorParams = Omit<
    IIncomeSource,
    'id' |
    'name_code' |
    'created_at' |
    'updated_at' |
    'deleted_at'
> & IPartialNestBaseEntity;

export type CreateIncomeSourceParams = ICreateIncomeSourceParams;

export type UpdateIncomeSourceParams = IUpdateIncomeSourceParams;