import type { IBill, ICreateBillParams, IPartialNestBaseEntity, IUpdateBillParams } from '../../api';

export type BillEntity = IBill

export type BillConstructorParams =
    Omit<BillEntity, 'id' | 'year' | 'total' | 'all_paid' | 'total_paid' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'>
    & IPartialNestBaseEntity
    & {
    year?: number;
    total?: number;
    all_paid?: boolean;
    total_paid?: number;
};

export type CreateBillParams = ICreateBillParams;

export type UpdateBillParams = IUpdateBillParams;