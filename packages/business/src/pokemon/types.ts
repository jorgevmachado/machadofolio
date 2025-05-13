import type { IPartialNestBaseEntity, IPokemon  } from '../api';

export type PokemonEntity = IPokemon;

export type PokemonConstructorParams = Omit< PokemonEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity;