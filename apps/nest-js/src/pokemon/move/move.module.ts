import { PokeApiService } from '@repo/business';

import { PokemonMove } from '../entities/move.entity';

import { MoveController } from './move.controller';
import { PokemonMoveService } from './move.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';


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