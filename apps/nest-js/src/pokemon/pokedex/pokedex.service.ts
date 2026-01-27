import { Repository } from 'typeorm';

import { Pokedex as PokedexConstructor,PokedexConstructorParams } from '@repo/business';

import { Service } from '../../shared';

import { Pokedex } from '../entities/pokedex.entity';
import { Pokemon } from '../entities/pokemon.entity';
import { PokemonTrainer } from '../entities/trainer.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type InitializePokedexParams = {
  pokemon: Pokemon;
  pokemons: Array<Pokemon>;
  pokemonTrainer: PokemonTrainer;
}

@Injectable()
export class PokedexService extends Service<Pokedex>{
  constructor(
    @InjectRepository(Pokedex) 
    protected repository: Repository<Pokedex>
  ) {
    super('pokedex', ['pokemon', 'pokemon_trainer'], repository);
  }

  async create(params: PokedexConstructorParams) {
    const pokedex = new PokedexConstructor(params);
    return await this.save(pokedex);
  }

  async initialize(params: InitializePokedexParams) {
    const { pokemon, pokemons: list, pokemonTrainer } = params;
    console.log('# => pokedex => service => list => ', list);
    const pokedex: Array<Pokedex> = [];
    for(const item of list) {
      const discovered = item.name === pokemon.name;
      const currentPokedex = new PokedexConstructor({ pokemon: item, pokemon_trainer: pokemonTrainer, discovered });
      const result = await this.save(currentPokedex) as Pokedex;
      pokedex.push(result)
    }
    return pokedex;
  }
}