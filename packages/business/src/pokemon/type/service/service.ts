import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import PokemonType from '../type';

export class PokemonTypeService extends BaseService<PokemonType, unknown, unknown>{
    constructor(private nest: Nest) {
        super(nest.pokemon.type, (response) => new PokemonType(response));
    }
}