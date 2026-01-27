import { type Nest } from '../../api';
import { BaseService } from '../../shared';

import Pokemon from '../pokemon';
import { type PokemonTrainer } from '../trainer';

export class PokemonService extends BaseService<Pokemon, unknown, unknown>{
    constructor(private nest: Nest) {
        super(nest.pokemon, (response) => new Pokemon(response));
    }
    
    async initialize(pokemonName?: string): Promise<PokemonTrainer> {
      return this.nest.pokemon.initialize(pokemonName);
    }
}