import { PokemonBusiness } from '@repo/business';

import { Pokedex } from '../entities/pokedex.entity';

import { PokedexController } from './pokedex.controller';
import { PokedexService } from './pokedex.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Pokedex])
  ],
  controllers: [PokedexController],
  providers: [PokedexService, PokemonBusiness],
  exports: [PokedexService]
})
export class PokedexModule {}