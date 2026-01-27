import { PokeApiService } from '@repo/business';

import { PokemonTrainer } from '../entities/trainer.entity';

import { PokemonTrainerController } from './trainer.controller';
import { PokemonTrainerService } from './trainer.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PokemonTrainer]),
  ],
  controllers: [PokemonTrainerController],
  providers: [PokemonTrainerService, PokeApiService],
  exports: [PokemonTrainerService]
})
export class TrainerModule {}