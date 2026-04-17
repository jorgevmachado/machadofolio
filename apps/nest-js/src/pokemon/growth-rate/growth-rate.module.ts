import { PokeApiService } from '@repo/business';

import { PokemonGrowthRate } from '../entities/growth-rate.entity';

import { PokemonGrowthRateController } from './growth-rate.controller';
import { PokemonGrowthRateService } from './growth-rate.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }) ,
    TypeOrmModule.forFeature([PokemonGrowthRate]) ,
  ] ,
  controllers: [PokemonGrowthRateController] ,
  providers: [PokemonGrowthRateService ,PokeApiService] ,
  exports: [PokemonGrowthRateService] ,
})
export class PokemonGrowthRateModule {
}