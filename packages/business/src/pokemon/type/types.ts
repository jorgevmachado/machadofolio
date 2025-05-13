import type { IPartialNestBaseEntity, IType } from '../../api';

export type TypeEntity = IType

export type TypeConstructorParams = Omit<TypeEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;