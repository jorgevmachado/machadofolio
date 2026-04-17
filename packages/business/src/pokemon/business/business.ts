import { generateInitialIvs } from '@repo/services';

import { EStatus } from '../../enum';

import type Pokemon from '../pokemon';

import { PokemonBattleBusiness } from './battle';

type CalculateStatsResult = {
  hp?: number;
  iv_hp?: number;
  ev_hp?: number;
  level?: number;
  max_hp?: number;
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
}

type CalculateStatsParams = CalculateStatsResult & {
  battle?: boolean;
  pokemon: Pokemon;
}

export default class PokemonBusiness {
  protected readonly battleBusiness: PokemonBattleBusiness;
  
  constructor() {
    this.battleBusiness = new PokemonBattleBusiness();
  }
  
  public get battle(): PokemonBattleBusiness {
    return this.battleBusiness;
  }

  public firstTrainerPokemon(pokemons: Array<Pokemon>, pokemonName: string): Pokemon | undefined {
    if(pokemons.length === 0) {
      return;
    }

    const pokemon = pokemons.find((pokemon) => pokemon.name === pokemonName);
    if(pokemon) {
      return pokemon;
    }
    const pokemonComplete = pokemons.find((pokemon) => pokemon.status === EStatus.COMPLETE);
    if(pokemonComplete) {
      return pokemonComplete;
    }
    const orders = pokemons.map(({ order }) => order);
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    return pokemons.find((pokemon) => pokemon.order === randomOrder) as Pokemon;
  }

  public calculateMaxHp(base_hp: number, iv_hp: number, ev_hp: number, level: number): number {
    return Math.floor(((2 * base_hp + iv_hp + Math.floor(ev_hp / 4)) * level) / 100) + level + 10;
  }

  public calculateStats({
    hp = 0,
    iv_hp = 0,
    ev_hp = 0,
    level = 1,
    max_hp = 0,
    battle,
    iv_speed = 0,
    ev_speed = 0,
    iv_attack = 0,
    ev_attack = 0,
    iv_defense = 0,
    ev_defense = 0,
    experience = 64,
    iv_special_attack = 0,
    ev_special_attack = 0,
    iv_special_defense = 0,
    ev_special_defense = 0,
    pokemon
  }: CalculateStatsParams): CalculateStatsResult {
    const formula = pokemon?.growth_rate?.formula ?? '';
    const initialIvs = {
      iv_hp: iv_hp === 0 ? generateInitialIvs() : iv_hp,
      iv_speed: iv_speed === 0 ? generateInitialIvs() : iv_speed,
      iv_attack: iv_attack === 0 ? generateInitialIvs() : iv_attack,
      iv_defense: iv_defense === 0 ? generateInitialIvs() : iv_defense,
      iv_special_attack: iv_special_attack === 0 ? generateInitialIvs() : iv_special_attack,
      iv_special_defense: iv_special_defense === 0 ? generateInitialIvs() : iv_special_defense,
    };

    const initialEvs = {
      ev_hp: ev_hp === 0 ? initialIvs.iv_hp : ev_hp,
      ev_speed: ev_speed === 0 ? initialIvs.iv_speed : ev_speed,
      ev_attack: ev_attack === 0 ? initialIvs.iv_attack : ev_attack,
      ev_defense: ev_defense === 0 ? initialIvs.iv_defense : ev_defense,
      ev_special_attack: ev_special_attack === 0 ? initialIvs.iv_special_attack : ev_special_attack,
      ev_special_defense: ev_special_defense === 0 ? initialIvs.iv_special_defense : ev_special_defense,
    };

    const baseStats: CalculateStatsResult = {
      hp,
      ...initialIvs,
      ...initialEvs,
      level,
      max_hp,
      experience,
    };

    const stats = battle ? (() => {
      const updated = this.battleBusiness.increaseAttributes({
        hp: baseStats.ev_hp,
        level: baseStats.level,
        speed: baseStats.ev_speed,
        attack: baseStats.ev_attack,
        defense: baseStats.ev_defense,
        formula,
        experience: baseStats.experience,
        special_attack: baseStats.ev_special_attack,
        base_experience: pokemon.base_experience,
        special_defense: baseStats.ev_special_defense,
      });
      return {
        ...baseStats,
        level: updated.level,
        ev_hp: updated.hp,
        ev_speed: updated.speed,
        ev_attack: updated.attack,
        ev_defense: updated.defense,
        experience: updated.experience,
        ev_special_attack: updated.special_attack,
        ev_special_defense: updated.special_defense,
      };
    })(): baseStats;

    const calculatedMaxHp =
      max_hp === 0
        ? (hp === 0 ? pokemon.hp : this.calculateMaxHp(pokemon.hp, stats.iv_hp ?? 0, stats.ev_hp ?? 0, stats.level ?? 1))
        : max_hp;

    const calculatedHp = Math.min(hp === 0 ? calculatedMaxHp : hp, calculatedMaxHp);

    return {
      ...stats,
      max_hp: calculatedMaxHp,
      hp: calculatedHp > calculatedMaxHp ? calculatedMaxHp : calculatedHp,
    };
  }
}