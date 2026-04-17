import {
  type CapturedPokemonConstructorParams ,
  type CapturedPokemonEntity,
} from './types';

export default class CapturedPokemon implements CapturedPokemonEntity {
  id!: CapturedPokemonEntity['id'];
  hp!: CapturedPokemonEntity['hp'];
  wins!: CapturedPokemonEntity['wins'];
  level!: CapturedPokemonEntity['level'];
  iv_hp!:  CapturedPokemonEntity['iv_hp'];
  ev_hp!:  CapturedPokemonEntity['ev_hp'];
  losses!: CapturedPokemonEntity['losses'];
  max_hp!: CapturedPokemonEntity['max_hp'];
  battles!: CapturedPokemonEntity['battles'];
  trainer!: CapturedPokemonEntity['trainer'];
  pokemon!: CapturedPokemonEntity['pokemon'];
  nickname?: CapturedPokemonEntity['nickname'];
  iv_speed!: CapturedPokemonEntity['iv_speed'];
  ev_speed!: CapturedPokemonEntity['ev_speed'];
  iv_attack!: CapturedPokemonEntity['iv_attack'];
  ev_attack!: CapturedPokemonEntity['ev_attack'];
  iv_defense!: CapturedPokemonEntity['iv_defense'];
  ev_defense!: CapturedPokemonEntity['ev_defense'];
  experience!: CapturedPokemonEntity['experience'];
  created_at!: CapturedPokemonEntity['created_at'];
  updated_at!: CapturedPokemonEntity['updated_at'];
  deleted_at?: CapturedPokemonEntity['deleted_at'];
  captured_at: CapturedPokemonEntity['captured_at'] = new Date();
  iv_special_attack!: CapturedPokemonEntity['iv_special_attack'];
  ev_special_attack!: CapturedPokemonEntity['ev_special_attack'];
  iv_special_defense!: CapturedPokemonEntity['iv_special_defense'];
  ev_special_defense!: CapturedPokemonEntity['ev_special_defense'];

  constructor(params?: CapturedPokemonConstructorParams) {
    this.hp = 0;
    this.wins = 0;
    this.level = 1;
    this.iv_hp = 0;
    this.ev_hp = 0;
    this.max_hp = 0;
    this.losses = 0;
    this.battles = 0;
    this.iv_speed = 0;
    this.ev_speed = 0;
    this.iv_attack = 0;
    this.ev_attack = 0;
    this.iv_defense = 0;
    this.ev_defense = 0;
    this.experience = 0;
    this.iv_special_attack = 0;
    this.ev_special_attack = 0;
    this.iv_special_defense = 0;
    this.ev_special_defense = 0;
    if (params) {
      this.id = params?.id ?? this.id;
      this.hp = params?.hp ?? this.hp;
      this.wins = params?.wins ?? this.wins;
      this.max_hp = params?.max_hp ?? this.max_hp;
      this.level = params?.level ?? this.level;
      this.iv_hp = params?.iv_hp ?? this.iv_hp;
      this.ev_hp = params?.ev_hp ?? this.ev_hp;
      this.losses = params?.losses ?? this.losses;
      this.battles = params?.battles ?? this.battles;
      this.pokemon = params?.pokemon;
      this.trainer = params?.trainer;
      this.nickname = params?.nickname ?? this.nickname;
      this.iv_speed = params?.iv_speed ?? this.iv_speed;
      this.ev_speed = params?.ev_speed ?? this.ev_speed;
      this.iv_attack = params?.iv_attack ?? this.iv_attack;
      this.ev_attack = params?.ev_attack ?? this.ev_attack;
      this.iv_defense = params?.iv_defense ?? this.iv_defense;
      this.ev_defense = params?.ev_defense ?? this.ev_defense;
      this.experience = params?.experience ?? this.experience;
      this.created_at = params?.created_at ?? this.created_at;
      this.updated_at = params?.updated_at ?? this.updated_at;
      this.deleted_at = params?.deleted_at ?? this.deleted_at;
      this.captured_at = params?.captured_at ?? this.captured_at;
      this.iv_special_attack = params?.iv_special_attack ?? this.iv_special_attack;
      this.ev_special_attack = params?.ev_special_attack ?? this.ev_special_attack;
      this.iv_special_defense = params?.iv_special_defense ?? this.iv_special_defense;
      this.ev_special_defense = params?.ev_special_defense ?? this.ev_special_defense;
    }
  }
}