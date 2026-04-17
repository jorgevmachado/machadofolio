import type { Nest } from '../../../api';
import { BaseService } from '../../../shared';

import PokemonAbility from '../ability';

export class PokemonAbilityService extends BaseService<PokemonAbility, unknown, unknown>{
    constructor(private nest: Nest) {
        super(nest.pokemon.ability, (response) => new PokemonAbility(response));
    }
}