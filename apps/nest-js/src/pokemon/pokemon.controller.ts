import { type QueryParameters } from '@repo/business';

import { User } from '../auth/entities/user.entity';
import { GetUserAuth } from '../decorators/auth-user/auth-user.decorator';
import { AuthRoleGuard } from '../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../guards/auth-status/auth-status.guard';

import { InitializeTrainerDto } from './dto/initialize-trainer.dto';
import { PokemonService } from './pokemon.service';

import {
  Body ,
  Controller ,
  Get ,
  Param ,
  Post ,
  Query ,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemon')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Get(':param')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Post('initialize')
  initialize(@GetUserAuth() user: User, @Body() initializeTrainerDto: InitializeTrainerDto) {
    return this.service.initialize(user, initializeTrainerDto);
  }
}
