import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import PokemonMove from '../move';

export class PokemonMoveService extends BaseService<PokemonMove, unknown, unknown>{
    constructor(private nest: Nest) {
        super(nest.pokemon.move, (response) => new PokemonMove(response));
    }
}