import { type ICaptured ,type IPartialNestBaseEntity } from '../../api';

export type CapturedPokemonEntity = ICaptured;

export type CapturedPokemonConstructorParams =
  Omit<CapturedPokemonEntity ,'id' | 'hp' | 'max_hp' | 'experience' | 'battles' | 'level' | 'wins' | 'losses' | 'created_at' | 'updated_at' | 'deleted_at'>
  & IPartialNestBaseEntity
  & {
  hp?: number;
  wins?: number;
  level?: number;
  max_hp?: number;
  losses?: number;
  battles?: number;
  experience?: number;
};