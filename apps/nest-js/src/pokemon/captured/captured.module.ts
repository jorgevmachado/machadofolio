import { PokemonBusiness } from '@repo/business';

import { CapturedPokemon } from '../entities/captured-pokemons.entity';

import { CapturedPokemonService } from './captured.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }) ,
    TypeOrmModule.forFeature([CapturedPokemon]) ,
  ] ,
  providers: [CapturedPokemonService, PokemonBusiness] ,
  exports: [CapturedPokemonService],
})
export class CapturedModule {
}