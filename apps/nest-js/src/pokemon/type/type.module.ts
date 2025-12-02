import { PokemonType } from '../entities/type.entity';

import { TypeController } from './type.controller';
import { PokemonTypeService } from './type.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([PokemonType]),
    ],
    controllers: [TypeController],
    providers: [PokemonTypeService],
    exports: [PokemonTypeService]
})
export class TypeModule {}