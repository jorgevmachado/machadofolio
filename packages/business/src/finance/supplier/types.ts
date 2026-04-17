import type { ICreateSupplierParams, IPartialNestBaseEntity, ISupplier, IUpdateSupplierParams } from '../../api';

export type SupplierEntity = ISupplier;

export type SupplierConstructorParams = Omit< SupplierEntity, 'id' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateSupplierParams = ICreateSupplierParams;

export type UpdateSupplierParams = IUpdateSupplierParams;