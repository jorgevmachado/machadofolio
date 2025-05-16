import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QueryParameters } from '@repo/business/types';

import { PokemonService } from './pokemon.service';

import { AuthRoleGuard } from '../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../guards/auth-status/auth-status.guard';

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
}
