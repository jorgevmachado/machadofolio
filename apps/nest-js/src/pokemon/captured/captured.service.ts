import { Repository } from 'typeorm';

import {
  CapturedPokemon as CapturedPokemonConstructor ,
  CapturedPokemonConstructorParams ,
} from '@repo/business';

import { Service } from '../../shared';

import { CapturedPokemon } from '../entities/captured-pokemons.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CapturedPokemonService extends Service<CapturedPokemon> {
  constructor(
    @InjectRepository(CapturedPokemon)
    protected repository: Repository<CapturedPokemon> ,
  ) {
    super('captured_pokemons' ,['pokemon'] ,repository);
  }

  async create(params: CapturedPokemonConstructorParams) {
    const capturedPokemon = new CapturedPokemonConstructor(params);
    const capturedPokemonDate = !capturedPokemon.captured_at ?
      new Date() :
      capturedPokemon.captured_at;
    return await this.save({
      ...capturedPokemon ,
      captured_at: capturedPokemonDate ,
    });
  }
}