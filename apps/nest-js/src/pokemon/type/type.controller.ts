import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { PokemonTypeService } from './type.service';

@Controller('type')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class TypeController {
  constructor(private readonly service: PokemonTypeService) {}
}
