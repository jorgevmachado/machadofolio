import type { IAbility, IPartialNestBaseEntity } from '../../api';

export type AbilityEntity = IAbility;

export type AbilityConstructorParams = Omit<AbilityEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;