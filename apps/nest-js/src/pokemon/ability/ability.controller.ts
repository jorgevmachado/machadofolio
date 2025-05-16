import { Controller } from '@nestjs/common';

import { PokemonAbilityService } from './ability.service';

@Controller('ability')
export class AbilityController {
  constructor(private readonly service: PokemonAbilityService) {}
}
