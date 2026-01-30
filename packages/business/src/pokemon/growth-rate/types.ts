import { type IGrowthRate ,type IPartialBaseEntity } from '../../api';

export type PokemonGrowthRateEntity = IGrowthRate;

export type PokemonGrowthRateConstructorParams = Omit<PokemonGrowthRateEntity ,'id' | 'order' | 'created_at' | 'updated_at' | 'deleted_at'>  & IPartialBaseEntity & {
  order?: number;
}