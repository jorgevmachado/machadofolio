import { ensureOrderNumber } from '@repo/services';

import type {
  PokemonGrowthRateConstructorParams ,
  PokemonGrowthRateEntity,
} from './types';

export default class PokemonGrowthRate implements PokemonGrowthRateEntity {
  id!: PokemonGrowthRateEntity['id'];
  url!: PokemonGrowthRateEntity['url'];
  name!: PokemonGrowthRateEntity['name'];
  order: PokemonGrowthRateEntity['order'] = 0;
  formula!: PokemonGrowthRateEntity['formula'];
  created_at!: PokemonGrowthRateEntity['created_at'];
  updated_at!: PokemonGrowthRateEntity['updated_at'];
  deleted_at?: PokemonGrowthRateEntity['deleted_at'];
  
  constructor(params?: PokemonGrowthRateConstructorParams) {
    this.id =  params?.id ?? this.id;
    this.url =  params?.url ?? this.url;
    this.name =  params?.name ?? this.name;
    this.order = ensureOrderNumber(params?.order ?? this.order, this.url);
    this.formula = params?.formula ?? this.formula;
    this.created_at =  params?.created_at ?? this.created_at;
    this.updated_at =  params?.updated_at ?? this.updated_at;
    this.deleted_at = params?.deleted_at ?? this.deleted_at;
  }
}