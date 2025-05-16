import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { PokemonAbilityService } from './ability.service';

@Controller('ability')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class AbilityController {
  constructor(private readonly service: PokemonAbilityService) {}
}
