import { Pokedex } from '../entities/pokedex.entity';

import { PokedexService } from './pokedex.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Pokedex])
  ],
  providers: [PokedexService],
  exports: [PokedexService]
})
export class PokedexModule {}