import { PokeApiService, PokemonBusiness } from '@repo/business';

import { AbilityModule } from './ability/ability.module';
import { CapturedModule } from './captured/captured.module';
import { Pokemon } from './entities/pokemon.entity';
import { MoveModule } from './move/move.module';
import { PokedexModule } from './pokedex/pokedex.module';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { TrainerModule } from './trainer/trainer.module';
import { TypeModule } from './type/type.module';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MoveModule,
    TypeModule,
    AbilityModule,
    CapturedModule,
    TrainerModule,
    PokedexModule
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService, PokemonBusiness],
  exports: [PokemonService]
})
export class PokemonModule {}
