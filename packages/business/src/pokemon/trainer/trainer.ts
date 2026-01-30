import type { PokemonTrainerConstructorParams ,PokemonTrainerEntity } from './types';

export default class PokemonTrainer implements PokemonTrainerEntity {
  id!: PokemonTrainerEntity['id'];
  user!: PokemonTrainerEntity['user'];
  pokedex?: PokemonTrainerEntity['pokedex'] = [];
  pokeballs!: PokemonTrainerEntity['pokeballs'];
  created_at!: PokemonTrainerEntity['created_at'];
  updated_at!: PokemonTrainerEntity['updated_at'];
  deleted_at?: PokemonTrainerEntity['deleted_at'];
  capture_rate?: PokemonTrainerEntity['capture_rate'] = 45;
  captured_pokemons?: PokemonTrainerEntity['captured_pokemons'] = [];

  constructor(params?: PokemonTrainerConstructorParams) {
    this.pokeballs = 5;
    if(params) {
      this.id = params.id;
      this.user = params.user;
      this.pokedex = params?.pokedex ?? this.pokedex;
      this.pokeballs = params?.pokeballs ?? this.pokeballs;
      this.created_at = params?.created_at ?? this.created_at;
      this.updated_at = params?.updated_at ?? this.updated_at;
      this.deleted_at = params?.deleted_at ?? this.deleted_at;
      this.capture_rate = params?.capture_rate ?? this.capture_rate;
      this.captured_pokemons = params?.captured_pokemons ?? this.captured_pokemons;
    }
  }
}