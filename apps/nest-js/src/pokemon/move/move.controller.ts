import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import {  PokemonMoveService } from './move.service';

@Controller('move')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class MoveController {
  constructor(private readonly service: PokemonMoveService) {}
}
