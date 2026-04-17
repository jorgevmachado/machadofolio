import type { IPartialNestBaseEntity, IPokedex } from '../../api';

export type PokedexEntity = IPokedex;

export type PokedexConstructorParams = Omit<
  PokedexEntity,
  'id' |
  'hp' |
  'wins' |
  'level' |
  'iv_hp' |
  'ev_hp' |
  'max_hp' |
  'losses' |
  'battles' |
  'iv_speed' |
  'ev_speed' |
  'iv_attack' |
  'ev_attack' |
  'iv_defense' |
  'ev_defense' |
  'experience' |
  'created_at' |
  'updated_at' |
  'deleted_at'|
  'pokemon_name'|
  'iv_special_attack' |
  'ev_special_attack' |
  'iv_special_defense' |
  'ev_special_defense'>
 & IPartialNestBaseEntity & {
  hp?: number;
  wins?: number;
  level?: number;
  iv_hp?: number;
  ev_hp?: number;
  max_hp?: number;
  losses?: number;
  battles?: number;
  iv_speed?: number;
  ev_speed?: number;
  iv_attack?: number;
  ev_attack?: number;
  iv_defense?: number;
  ev_defense?: number;
  experience?: number;
  iv_special_attack?: number;
  ev_special_attack?: number;
  iv_special_defense?: number;
  ev_special_defense?: number;
};