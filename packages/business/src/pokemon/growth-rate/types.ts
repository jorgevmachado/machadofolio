import { type IGrowth ,type IPartialBaseEntity } from '../../api';

export type PokemonGrowthRateEntity = IGrowth;

export type PokemonGrowthRateConstructorParams = Omit<PokemonGrowthRateEntity ,'id' | 'order' | 'created_at' | 'updated_at' | 'deleted_at'>  & IPartialBaseEntity & {
  order?: number;
}