import type {
    ICreateSupplierTypeParams,
    IPartialNestBaseEntity,
    ISupplierType,
    IUpdateSupplierTypeParams
} from '../../api';

export type SupplierTypeEntity = ISupplierType;

export type SupplierTypeConstructorParams = Omit< SupplierTypeEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateSupplierTypeParams = ICreateSupplierTypeParams;

export type UpdateSupplierTypeParams = IUpdateSupplierTypeParams;