import type { PokedexConstructorParams ,PokedexEntity } from './types';

export default class Pokedex implements PokedexEntity {
  id!: PokedexEntity['id'];
  pokemon!: PokedexEntity['pokemon'];
  discovered!: PokedexEntity['discovered'];
  created_at!: PokedexEntity['created_at'];
  updated_at!: PokedexEntity['updated_at'];
  deleted_at?: PokedexEntity['deleted_at'];
  pokemon_trainer!: PokedexEntity['pokemon_trainer'];

  constructor(params: PokedexConstructorParams) {
    this.id = params.id;
    this.pokemon = params.pokemon;
    this.discovered = params.discovered;
    this.created_at = params?.created_at ?? this.created_at;
    this.updated_at = params?.updated_at ?? this.updated_at;
    this.deleted_at = params?.deleted_at ?? this.deleted_at;
    this.pokemon_trainer = params.pokemon_trainer;
  }
}