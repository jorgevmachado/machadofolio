import { Repository } from 'typeorm';

import { generateInitialIvs ,getExperience ,getStat } from '@repo/services';

import {
  CapturedPokemon as CapturedPokemonConstructor ,
  CapturedPokemonConstructorParams ,PokemonBusiness ,
} from '@repo/business';

import { Service } from '../../shared';

import { CapturedPokemon } from '../entities/captured-pokemons.entity';
import { PokemonMove } from '../entities/move.entity';
import { Pokemon } from '../entities/pokemon.entity';
import { PokemonTrainer } from '../entities/trainer.entity';
import { ProcessPokemonParams } from '../types';

import { BadRequestException ,Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type BattleResult = {
  level: number;
  winner: 'DRAW' | 'TRAINER' | 'WILD';
  experience: number;
  wild_pokemon_hp: number;
  trainer_pokemon_hp: number,
  wild_pokemon_damage: number;
  trainer_pokemon_damage: number;
}

type BusinessCalculateTrainerDamageParams = {
  level: number;
  power?: number;
  attack?: number;
  defense?: number;
  iv_attack: number;
  ev_attack: number;
  iv_defense: number;
  ev_defense: number;
}

type BusinessCalculateWildPokemonDamageParams = {
  level: number;
  moves?: Array<PokemonMove>;
  attack?: number;
  defense?: number;
}

@Injectable()
export class CapturedPokemonService extends Service<CapturedPokemon> {
  constructor(
    @InjectRepository(CapturedPokemon)
    protected repository: Repository<CapturedPokemon> ,
    protected pokemonBusiness: PokemonBusiness ,
  ) {
    super('captured_pokemons' ,['pokemon' ,'pokemon.moves'] ,repository);
  }

  async create(params: CapturedPokemonConstructorParams) {
    const pokemon = params.pokemon;
    const stats = this.pokemonBusiness.calculateStats({
      ...params ,
      pokemon
    });
    const capturedPokemon = new CapturedPokemonConstructor({
      ...params ,
      ...stats
    });
    const capturedPokemonDate = !capturedPokemon.captured_at ?
      new Date() :
      capturedPokemon.captured_at;
    return await this.save({
      ...capturedPokemon ,
      captured_at: capturedPokemonDate ,
    });
  }

  async findOneCapturedPokemon({
    pokemon ,
    trainer ,
    withThrow = true ,
    withRelations = true,
  }: ProcessPokemonParams): Promise<CapturedPokemon> {
    return await this.queries.find({
      filters: [
        {
          value: trainer.id ,
          param: 'trainer' ,
          condition: '=' ,
        } ,
        {
          value: pokemon.id ,
          param: 'pokemon' ,
          condition: '=' ,
        } ,
      ] ,
      withThrow ,
      withRelations ,
    }) as CapturedPokemon;
  }

  async addToTrainer(
    trainer: PokemonTrainer ,
    pokemon: Pokemon ,
    name?: string): Promise<CapturedPokemon> {
    const capturedPokemon = await this.findOneCapturedPokemon(
      { pokemon ,trainer ,withThrow: false });
    if (capturedPokemon) {
      throw this.error(new BadRequestException('Pokemon already captured'));
    }
    const nickname = name || pokemon.name;
    return await this.create({ trainer ,pokemon ,nickname }) as CapturedPokemon;
  }

  async battle(trainer: PokemonTrainer ,wildPokemon: Pokemon ,
    trainerPokemon: Pokemon ,pokemon_move: string) {
    const battleResult: BattleResult = {
      level: 0 ,
      winner: 'DRAW' ,
      experience: 0 ,
      wild_pokemon_hp: 0 ,
      trainer_pokemon_hp: 0 ,
      wild_pokemon_damage: 0 ,
      trainer_pokemon_damage: 0,
    };
    // const capturedPokemon = await this.findOneCapturedPokemon(
    //   { pokemon: trainerPokemon ,trainer ,withThrow: true });
    // console.log('# => capturedPokemon => ' ,capturedPokemon);
    // const trainerPokemonMove = capturedPokemon.pokemon.moves?.find(
    //   (move) => move.name === pokemon_move);
    // if (!trainerPokemonMove) {
    //   throw this.error(new BadRequestException('Pokemon move not found.'));
    // }
    //
    // battleResult.level = capturedPokemon.level;
    //
    // const trainerPokemonDamage = this.pokemonBattleBusiness.calculateTrainerPokemonDamage ({
    //   level: battleResult.level ,
    //   power: trainerPokemonMove.power ,
    //   attack: trainerPokemon.attack ,
    //   defense: trainerPokemon.defense ,
    //   iv_attack: capturedPokemon.iv_attack ,
    //   ev_attack: capturedPokemon.ev_attack ,
    //   iv_defense: capturedPokemon.iv_defense ,
    //   ev_defense: capturedPokemon.ev_defense ,
    // });
    //
    // battleResult.wild_pokemon_hp = wildPokemon.hp ?? 0 - trainerPokemonDamage;
    //
    // const wildPokemonDamage = this.pokemonBattleBusiness.calculateWildPokemonDamage({
    //   level: battleResult.level ,
    //   moves: wildPokemon?.moves ,
    //   attack: wildPokemon?.attack ,
    //   defense: wildPokemon?.defense,
    // });
    //
    // battleResult.trainer_pokemon_hp = capturedPokemon.hp - wildPokemonDamage;
    //
    // battleResult.winner = this.pokemonBattleBusiness.calculateWinner(
    //   battleResult.trainer_pokemon_hp ,battleResult.wild_pokemon_hp);
    //
    // if (battleResult.winner === 'TRAINER') {
    //   const currentCapturedPokemon = await this.levelUp(capturedPokemon.hp ,
    //     capturedPokemon ,wildPokemon);
    //   battleResult.level = currentCapturedPokemon.level;
    // }

    return battleResult;
  }

  public async levelUp(
    hp: number ,capturedPokemon: CapturedPokemon ,
    wildPokemon: Pokemon): Promise<CapturedPokemon> {
    const currentCapturedPokemon = new CapturedPokemonConstructor({
      ...capturedPokemon ,
    });
    const expGain = Math.floor((wildPokemon.base_experience ?? 45) / 7);

    const resultLevelUp = {
      level: capturedPokemon.level ,
      experience: capturedPokemon.experience + expGain,
    };

    while (resultLevelUp.experience >=
    getExperience(capturedPokemon.level + 1)) {
      resultLevelUp.level += 1;
    }

    const newEvHp = (capturedPokemon.ev_hp ?? 0) + (wildPokemon.hp ?? 0);
    const newEvAttack = (capturedPokemon.ev_attack ?? 0) +
      (wildPokemon.attack ?? 0);
    const newEvDefense = (capturedPokemon.ev_defense ?? 0) +
      (wildPokemon.defense ?? 0);
    const newEvSpecialAttack = (capturedPokemon.ev_special_attack ?? 0) +
      (wildPokemon.special_attack ?? 0);
    const newEvSpecialDefense = (capturedPokemon.ev_special_defense ?? 0) +
      (wildPokemon.special_defense ?? 0);
    const newEvSpeed = (capturedPokemon.ev_speed ?? 0) +
      (wildPokemon.speed ?? 0);

    return await this.save({
      ...capturedPokemon ,
      hp ,
      ev_hp: newEvHp ,
      level: resultLevelUp.level ,
      ev_speed: newEvSpeed ,
      ev_attack: newEvAttack ,
      ev_defense: newEvDefense ,
      experience: resultLevelUp.experience ,
      ev_special_attack: newEvSpecialAttack ,
      ev_special_defense: newEvSpecialDefense ,
    }) as CapturedPokemon;
  }
}