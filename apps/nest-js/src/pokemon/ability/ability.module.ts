import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PokemonAbility } from '../entities/ability.entity';

import { AbilityController } from './ability.controller';
import { PokemonAbilityService } from './ability.service';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PokemonAbility]),
  ],
  controllers: [AbilityController],
  providers: [PokemonAbilityService],
  exports: [PokemonAbilityService]
})
export class AbilityModule {}
