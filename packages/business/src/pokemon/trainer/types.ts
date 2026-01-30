import type { IPartialNestBaseEntity ,ITrainer } from '../../api';

export type PokemonTrainerEntity = ITrainer;

export type PokemonTrainerConstructorParams = Omit<ITrainer, 'id'  | 'pokeballs' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity & {
  pokeballs?: number;
};