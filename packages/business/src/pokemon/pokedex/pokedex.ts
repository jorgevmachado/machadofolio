import type { PokedexConstructorParams ,PokedexEntity } from './types';

export default class Pokedex implements PokedexEntity {
  id!: PokedexEntity['id'];
  hp!: PokedexEntity['hp'];
  wins!: PokedexEntity['wins'];
  level!: PokedexEntity['level'];
  iv_hp!:  PokedexEntity['iv_hp'];
  ev_hp!:  PokedexEntity['ev_hp'];
  losses!: PokedexEntity['losses'];
  max_hp!: PokedexEntity['max_hp'];
  battles!: PokedexEntity['battles'];
  pokemon!: PokedexEntity['pokemon'];
  iv_speed!: PokedexEntity['iv_speed'];
  ev_speed!: PokedexEntity['ev_speed'];
  iv_attack!: PokedexEntity['iv_attack'];
  ev_attack!: PokedexEntity['ev_attack'];
  iv_defense!: PokedexEntity['iv_defense'];
  ev_defense!: PokedexEntity['ev_defense'];
  experience!: PokedexEntity['experience'];
  discovered!: PokedexEntity['discovered'];
  created_at!: PokedexEntity['created_at'];
  updated_at!: PokedexEntity['updated_at'];
  deleted_at?: PokedexEntity['deleted_at'];
  pokemon_name!: PokedexEntity['pokemon_name'];
  pokemon_trainer!: PokedexEntity['pokemon_trainer'];
  iv_special_attack!: PokedexEntity['iv_special_attack'];
  ev_special_attack!: PokedexEntity['ev_special_attack'];
  iv_special_defense!: PokedexEntity['iv_special_defense'];
  ev_special_defense!: PokedexEntity['ev_special_defense'];

  constructor(params: PokedexConstructorParams) {
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
    if(params) {
      this.id = params.id;
      this.hp = params?.hp ?? this.hp;
      this.wins = params?.wins ?? this.wins;
      this.max_hp = params?.max_hp ?? this.max_hp;
      this.level = params?.level ?? this.level;
      this.iv_hp = params?.iv_hp ?? this.iv_hp;
      this.ev_hp = params?.ev_hp ?? this.ev_hp;
      this.losses = params?.losses ?? this.losses;
      this.battles = params?.battles ?? this.battles;
      this.pokemon = params.pokemon;
      this.iv_speed = params?.iv_speed ?? this.iv_speed;
      this.ev_speed = params?.ev_speed ?? this.ev_speed;
      this.iv_attack = params?.iv_attack ?? this.iv_attack;
      this.ev_attack = params?.ev_attack ?? this.ev_attack;
      this.iv_defense = params?.iv_defense ?? this.iv_defense;
      this.ev_defense = params?.ev_defense ?? this.ev_defense;
      this.experience = params?.experience ?? this.experience;
      this.discovered = params.discovered;
      this.created_at = params?.created_at ?? this.created_at;
      this.updated_at = params?.updated_at ?? this.updated_at;
      this.deleted_at = params?.deleted_at ?? this.deleted_at;
      this.pokemon_name = this.pokemon.name;
      this.pokemon_trainer = params.pokemon_trainer;
      this.iv_special_attack = params?.iv_special_attack ?? this.iv_special_attack;
      this.ev_special_attack = params?.ev_special_attack ?? this.ev_special_attack;
      this.iv_special_defense = params?.iv_special_defense ?? this.iv_special_defense;
      this.ev_special_defense = params?.ev_special_defense ?? this.ev_special_defense;
    }
  }
}