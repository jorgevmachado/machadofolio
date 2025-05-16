import { Controller } from '@nestjs/common';

import { PokemonTypeService } from './type.service';

@Controller('type')
export class TypeController {
  constructor(private readonly service: PokemonTypeService) {}
}
