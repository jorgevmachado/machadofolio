import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PokeApiService } from '@repo/business/pokemon/poke-api/service/service';

import { AbilityModule } from './ability/ability.module';
import { MoveModule } from './move/move.module';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { TypeModule } from './type/type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MoveModule,
    TypeModule,
    AbilityModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService],
  exports: [PokemonService]
})
export class PokemonModule {}
