import type { IBank, ICreateBankParams, IPartialNestBaseEntity, IUpdateBankParams } from '../../api';

export type BankEntity = IBank

export type BankConstructorParams = Omit< BankEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;

export type CreateBankParams = ICreateBankParams;

export type UpdateBankParams = IUpdateBankParams;