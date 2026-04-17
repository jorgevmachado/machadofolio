import { Repository } from 'typeorm';

import { generateInitialIvs } from '@repo/services';

import {
  PaginateParameters ,
  Pokedex as PokedexConstructor ,type PokedexConstructorParams ,
  PokemonBusiness ,
} from '@repo/business';

import { ListParams ,Service } from '../../shared';

import { Pokedex } from '../entities/pokedex.entity';
import { Pokemon } from '../entities/pokemon.entity';
import { PokemonTrainer } from '../entities/trainer.entity';
import { ProcessPokemonParams } from '../types';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type InitializePokedexParams = {
  pokemon: Pokemon;
  pokemons: Array<Pokemon>;
  pokemonTrainer: PokemonTrainer;
}

@Injectable()
export class PokedexService extends Service<Pokedex> {
  constructor(
    @InjectRepository(Pokedex)
    protected repository: Repository<Pokedex> ,
    protected pokemonBusiness: PokemonBusiness ,
  ) {
    super('pokedex' ,['pokemon' ,'pokemon_trainer'] ,repository);
  }

  // Experiencia está diferente da base_experience
  // HP está diferente do hp do pokemon
  async initialize(params: InitializePokedexParams) {
    const { pokemon ,pokemons: list ,pokemonTrainer } = params;
    const pokedex: Array<Pokedex> = [];
    for (const item of list) {
      const discovered = item.name === pokemon.name;
      const result = await this.persist({
        pokemon: item,
        discovered,
        pokemon_trainer: pokemonTrainer,
      })
      pokedex.push(result);
    }
    return pokedex;
  }

  async persist(params: PokedexConstructorParams): Promise<Pokedex> {
    const pokemon = params.pokemon;
    const stats = this.pokemonBusiness.calculateStats({
      ...params ,
      pokemon
    });
    const currentPokedex = new PokedexConstructor({
      ...params ,
      ...stats
    });

    return await this.save(currentPokedex) as Pokedex;
  }

  async add({ trainer ,pokemon }: ProcessPokemonParams): Promise<Pokedex> {
    const pokedex = await this.findOnePokedex({ trainer ,pokemon })  as Pokedex;
    if (pokedex.discovered) {
      return pokedex;
    }

    const pokedexToUpdate = new PokedexConstructor({
      ...pokedex ,
      discovered: true
    });
    return await this.save(pokedexToUpdate) as Pokedex;
  }

  async findOnePokedex({ trainer ,pokemon }: ProcessPokemonParams) {
    return await this.queries.find({
      filters: [
        {
          value: trainer.id ,
          param: 'pokemon_trainer' ,
          condition: '=' ,
        } ,
        {
          value: pokemon.id ,
          param: 'pokemon' ,
          condition: '=' ,
        },
      ] ,
      withThrow: true ,
      withRelations: true
    });
  }

  async listAll(trainer: PokemonTrainer, listParams?: ListParams): Promise<Array<Pokedex> | PaginateParameters<Pokedex>> {
    return super.findAll({ ...listParams, filters: [
        ...listParams?.filters || [] ,
        {
          value: trainer.id ,
          param: 'pokemon_trainer' ,
          condition: '=' ,
        }
      ], withRelations: true });
  }

  async getAllPokemons(trainer: PokemonTrainer, type: 'ALL' | 'DISCOVERED' | 'WILD' = 'ALL'): Promise<Array<Pokemon>> {
    const list = await this.listAll(trainer) as Array<Pokedex>;

    if(type === 'ALL') {
      return list.map((item) => item.pokemon);
    }

    const discovered = type === 'DISCOVERED';
    return list.filter((item) => item.discovered === discovered).map((item) => item.pokemon);
  }

  async hasPokemonBeenDiscovered({ trainer ,pokemon }: ProcessPokemonParams) {
    const pokedex = await this.findOnePokedex({ trainer ,pokemon })  as Pokedex;
    return pokedex.discovered;
  }
}