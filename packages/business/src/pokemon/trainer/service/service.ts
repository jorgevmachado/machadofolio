import { type Nest } from '../../../api';
import { BaseService } from '../../../shared';

import PokemonTrainer from '../trainer';

export class PokemonTrainerService extends BaseService<PokemonTrainer ,unknown ,unknown>{
  constructor(private nest: Nest) {
    super(nest.pokemon.trainer, (response) => new PokemonTrainer(response));
  }

  public async initialize(): Promise<PokemonTrainer> {
    return this.nest.pokemon.trainer.initialize().then((response) => new PokemonTrainer(response));
  }
}