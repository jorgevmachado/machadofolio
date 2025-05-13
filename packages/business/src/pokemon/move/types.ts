import type { IMove, IPartialNestBaseEntity } from '../../api';

export type MoveEntity = IMove;

export type MoveConstructorParams = Omit<MoveEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;
