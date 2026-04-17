import { type Pokemon } from './entities/pokemon.entity';
import { type PokemonTrainer } from './entities/trainer.entity';

export type ProcessPokemonParams = {
  level?: number;
  trainer: PokemonTrainer;
  pokemon: Pokemon;
  nickname?: string;
  withThrow?: boolean;
  withRelations?: boolean;
}