import type { Nest } from '../../../api';
import { BaseService } from '../../../shared';

import PokemonType from '../type';

export class PokemonTypeService extends BaseService<PokemonType, unknown, unknown>{
    constructor(private nest: Nest) {
        super(nest.pokemon.type, (response) => new PokemonType(response));
    }
}