import { PokemonTrainer ,User } from '@repo/business';

import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';
import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import {
  PokemonInitializeGuard
} from '../../guards/pokemon-initialize/pokemon-initialize.guard';

import { PokemonTrainerService } from './trainer.service';

import { Controller ,Get ,UseGuards  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemon')
@UseGuards(AuthGuard() ,AuthRoleGuard ,AuthStatusGuard, PokemonInitializeGuard)
export class PokemonTrainerController {
  constructor(private readonly service: PokemonTrainerService) {}

  @Get('/user/trainer')
  trainer(@GetUserAuth() user: User ) {
    const pokemonTrainer = user.pokemon_trainer as PokemonTrainer;
    return this.service.findOne({ value: pokemonTrainer.id, withRelations: true });
  }

}
