import type { IPartialBaseEntity, IType } from '../../api';

export type PokemonTypeEntity = IType

export type TypeConstructorParams = Omit<PokemonTypeEntity, 'id' | 'order' | 'text_color' | 'background_color' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialBaseEntity & {
    order?: number;
    text_color?: string;
    background_color?: string;
};