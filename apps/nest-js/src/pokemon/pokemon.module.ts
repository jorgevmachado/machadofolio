import { PokeApiService } from '@repo/business';

import { AbilityModule } from './ability/ability.module';
import { Pokemon } from './entities/pokemon.entity';
import { MoveModule } from './move/move.module';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
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
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService],
  exports: [PokemonService]
})
export class PokemonModule {}
