import { Repository } from 'typeorm';

import {
  PokemonTrainer as PokemonTrainerConstructor ,
  PokemonTrainerConstructorParams,
} from '@repo/business';

import { User } from '../../auth/entities/user.entity';
import { Service } from '../../shared';

import { PokemonTrainer } from '../entities/trainer.entity';

import { Injectable ,NotFoundException } from '@nestjs/common';
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

   async update(user: User, params: Omit<PokemonTrainerConstructorParams, 'user'>) {
    const trainer = await this.findOne({ value: user.id, withDeleted: true });
    if(!trainer) {
      return new PokemonTrainerConstructor({user: user as User});
    }
    const newTrainer = new PokemonTrainerConstructor({...params, user: user as User});
    return await this.save({...trainer, ...newTrainer});
   }

   async findTrainer(user: User) {
    if(!user.pokemon_trainer) {
      throw new NotFoundException('Trainer not found');
    }
    return await this.findOne({ value: user.pokemon_trainer.id, withRelations: true })
   }
}