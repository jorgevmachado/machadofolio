import { type ICaptured ,type IPartialNestBaseEntity } from '../../api';

export type CapturedPokemonEntity = ICaptured;

export type CapturedPokemonConstructorParams = Omit<CapturedPokemonEntity, 'id'  | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;