import { type Nest } from '../../api';
import { BaseService } from '../../shared';

import Pokemon from '../pokemon';

export class PokemonService extends BaseService<Pokemon, unknown, unknown>{
    constructor(private nest: Nest) {
        super(nest.pokemon, (response) => new Pokemon(response));
    }
}