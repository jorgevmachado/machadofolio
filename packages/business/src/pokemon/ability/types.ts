import type { IAbility, IPartialBaseEntity } from '../../api';

export type PokemonAbilityEntity = IAbility;

export type AbilityConstructorParams = Omit<PokemonAbilityEntity, 'id' | 'order' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialBaseEntity & {
    order?: number;
};