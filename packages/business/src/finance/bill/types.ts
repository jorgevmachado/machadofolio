import type { IBill, ICreateBillParams, IPartialNestBaseEntity, IUpdateBillParams } from '../../api';

export type BillEntity = IBill

export type BillConstructorParams = Omit< BillEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateBillParams = ICreateBillParams;

export type UpdateBillParams = IUpdateBillParams;