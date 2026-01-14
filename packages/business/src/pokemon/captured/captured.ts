import {
  type CapturedPokemonConstructorParams ,
  type CapturedPokemonEntity,
} from './types';

export default class CapturedPokemon implements CapturedPokemonEntity {
  id!: CapturedPokemonEntity['id'];
  user!: CapturedPokemonEntity['user'];
  pokemon!: CapturedPokemonEntity['pokemon'];
  nickname?: CapturedPokemonEntity['nickname'];
  created_at!: CapturedPokemonEntity['created_at'];
  updated_at!: CapturedPokemonEntity['updated_at'];
  deleted_at?: CapturedPokemonEntity['deleted_at'];
  captured_at: CapturedPokemonEntity['captured_at'] = new Date();

  constructor(params?: CapturedPokemonConstructorParams) {
    if (params) {
      this.id = params?.id ?? this.id;
      this.user = params?.user;
      this.pokemon = params?.pokemon;
      this.nickname = params?.nickname ?? this.nickname;
      this.created_at = params?.created_at ?? this.created_at;
      this.updated_at = params?.updated_at ?? this.updated_at;
      this.deleted_at = params?.deleted_at ?? this.deleted_at;
      this.captured_at = params?.captured_at ?? this.captured_at;
    }
  }
}