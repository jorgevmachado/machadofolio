import {
  type CapturedPokemonConstructorParams ,
  type CapturedPokemonEntity,
} from './types';

export default class CapturedPokemon implements CapturedPokemonEntity {
  id!: CapturedPokemonEntity['id'];
  hp!: CapturedPokemonEntity['hp'];
  wins!: CapturedPokemonEntity['wins'];
  level!: CapturedPokemonEntity['level'];
  losses!: CapturedPokemonEntity['losses'];
  max_hp!: CapturedPokemonEntity['max_hp'];
  battles!: CapturedPokemonEntity['battles'];
  trainer!: CapturedPokemonEntity['trainer'];
  pokemon!: CapturedPokemonEntity['pokemon'];
  nickname?: CapturedPokemonEntity['nickname'];
  experience!: CapturedPokemonEntity['experience'];
  created_at!: CapturedPokemonEntity['created_at'];
  updated_at!: CapturedPokemonEntity['updated_at'];
  deleted_at?: CapturedPokemonEntity['deleted_at'];
  captured_at: CapturedPokemonEntity['captured_at'] = new Date();

  constructor(params?: CapturedPokemonConstructorParams) {
    this.hp = 0;
    this.wins = 0;
    this.level = 1;
    this.max_hp = 0;
    this.losses = 0;
    this.battles = 0;
    this.experience = 0;
    if (params) {
      this.id = params?.id ?? this.id;
      this.hp = params?.hp ?? this.hp;
      this.wins = params?.wins ?? this.wins;
      this.max_hp = params?.max_hp ?? this.max_hp;
      this.level = params?.level ?? this.level;
      this.losses = params?.losses ?? this.losses;
      this.battles = params?.battles ?? this.battles;
      this.pokemon = params?.pokemon;
      this.trainer = params?.trainer;
      this.nickname = params?.nickname ?? this.nickname;
      this.experience = params?.experience ?? this.experience;
      this.created_at = params?.created_at ?? this.created_at;
      this.updated_at = params?.updated_at ?? this.updated_at;
      this.deleted_at = params?.deleted_at ?? this.deleted_at;
      this.captured_at = params?.captured_at ?? this.captured_at;
    }
  }
}