import { PokemonTrainer ,type QueryParameters ,User } from '@repo/business';

import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';
import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import {
  PokemonInitializeGuard,
} from '../../guards/pokemon-initialize/pokemon-initialize.guard';

import { PokedexService } from './pokedex.service';

import { Controller ,Get ,Query ,UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemon')
@UseGuards(AuthGuard() ,AuthRoleGuard ,AuthStatusGuard ,PokemonInitializeGuard)
export class PokedexController {
  constructor(private readonly service: PokedexService) {
  }

  @Get('/trainer/pokedex')
  findAll(@GetUserAuth() user: User ,@Query() parameters: QueryParameters) {
    const pokemonTrainer = user.pokemon_trainer as PokemonTrainer;
    return this.service.listAll(pokemonTrainer ,
      { parameters ,withRelations: true });
  }

}
