import type { IPartialBaseEntity, IPokemon } from '../api';

export type PokemonEntity = IPokemon;

export type PokemonConstructorParams = Omit< PokemonEntity, 'id' | 'order' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialBaseEntity & {
    order?: number;
    status?: PokemonEntity['status'];
};