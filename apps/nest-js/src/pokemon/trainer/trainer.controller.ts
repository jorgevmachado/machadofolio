import { User } from '@repo/business';

import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';
import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { PokemonTrainerService } from './trainer.service';

import { Controller ,Get ,UseGuards  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemon')
@UseGuards(AuthGuard() ,AuthRoleGuard ,AuthStatusGuard)
export class PokemonTrainerController {
  constructor(private readonly service: PokemonTrainerService) {}

  @Get('/user/trainer')
  trainer(@GetUserAuth() user: User ) {
    return this.service.findTrainer(user);
  }

}
