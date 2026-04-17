import { Repository } from 'typeorm';

import {
  PokemonTrainer as PokemonTrainerConstructor ,
  PokemonTrainerConstructorParams,
} from '@repo/business';

import { User } from '../../auth/entities/user.entity';
import { Service } from '../../shared';

import { PokemonTrainer } from '../entities/trainer.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PokemonTrainerService extends Service<PokemonTrainer>{
  constructor(
    @InjectRepository(PokemonTrainer)
    protected repository: Repository<PokemonTrainer>,
  ) {
    super('pokemon_trainers', ['captured_pokemons', 'pokedex', 'user'], repository);
  }

   async create(user: User, params?: PokemonTrainerConstructorParams) {
     if(user?.pokemon_trainer) {
       return {
         ...user.pokemon_trainer,
         user
       }
     }
     const trainer = new PokemonTrainerConstructor({...params, user: user as User});
     return await this.save(trainer);
   }

   async update(param: string, params: Omit<PokemonTrainerConstructorParams, 'user'>) {
    const trainer = await this.findOne({ value: param, withDeleted: true });
    if(!trainer) {
      return new PokemonTrainerConstructor();
    }
    const newTrainer = new PokemonTrainerConstructor({ ...trainer, ...params, user: trainer.user });
    return await this.save(newTrainer);
   }
}