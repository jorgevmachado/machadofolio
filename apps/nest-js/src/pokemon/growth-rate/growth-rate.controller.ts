import { type QueryParameters } from '@repo/business';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { PokemonGrowthRateService } from './growth-rate.service';

import { Controller ,Get ,Param ,Query ,UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemon')
@UseGuards(AuthGuard() ,AuthRoleGuard ,AuthStatusGuard)
export class PokemonGrowthRateController {
  constructor(private readonly service: PokemonGrowthRateService) {
  }

  @Get('/list/type')
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Get(':param/type')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }
}