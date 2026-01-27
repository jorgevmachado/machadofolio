import type { IPartialNestBaseEntity, IPokedex } from '../../api';

export type PokedexEntity = IPokedex;

export type PokedexConstructorParams = Omit<PokedexEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;