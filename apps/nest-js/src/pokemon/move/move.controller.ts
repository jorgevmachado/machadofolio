import { Controller } from '@nestjs/common';

import {  PokemonMoveService } from './move.service';

@Controller('move')
export class MoveController {
  constructor(private readonly service: PokemonMoveService) {}
}
