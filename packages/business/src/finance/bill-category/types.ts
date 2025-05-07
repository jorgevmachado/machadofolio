import type {
    IBillCategory,
    ICreateBillCategoryParams,
    IPartialNestBaseEntity,
    IUpdateBillCategoryParams
} from '../../api';

export type BillCategoryEntity = IBillCategory

export type BillCategoryConstructorParams = Omit< BillCategoryEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateBillCategoryParams = ICreateBillCategoryParams;

export type UpdateBillCategoryParams = IUpdateBillCategoryParams;