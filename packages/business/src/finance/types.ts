import type { IFinance, IPartialNestBaseEntity } from '../api';

export type FinanceEntity = IFinance;

export type FinanceConstructorParams = Omit< FinanceEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;