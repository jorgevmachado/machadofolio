import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PokeApiService } from '@repo/business';

import { MoveController } from './move.controller';
import { PokemonMove } from '../entities/move.entity';
import { PokemonMoveService } from './move.service';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PokemonMove]),
  ],
  controllers: [MoveController],
  providers: [PokemonMoveService, PokeApiService],
  exports: [PokemonMoveService]
})
export class MoveModule {}
