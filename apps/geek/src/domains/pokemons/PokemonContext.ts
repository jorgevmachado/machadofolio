import React from 'react';

import {
  type Paginate ,
  type Pokemon ,
  type PokemonTrainer ,type PokemonTrainerEntity ,
  type QueryParameters ,type User ,
} from '@repo/business';

export type PokemonContextProps = {
  pokemons: Array<Pokemon>;
  fetchOne: (name: string, updateList?: boolean) => Promise<Pokemon | undefined>;
  isLoading: boolean;
  totalPages: number;
  initialize: (pokemonName?: string) => Promise<PokemonTrainer>;
  fetchPokemons: (params: QueryParameters) => Promise<Paginate<Pokemon>>;
}

const DEFAULT_FETCH_POKEMONS: Paginate<Pokemon> = {
  skip:  0,
  next: 0,
  prev: 0,
  total: 0,
  pages: 0,
  results: [],
  per_page: 0,
  current_page: 0,
};

const DEFAULT_FETCH_TRAINER: PokemonTrainer = {
  id: '0',
  user: { } as User,
  created_at: new Date(),
  updated_at: new Date(),
};

export const PokemonContext = React.createContext<PokemonContextProps>({
  pokemons: [],
  fetchOne: () => Promise.resolve(undefined),
  isLoading: false,
  totalPages: 0,
  initialize: () => Promise.resolve(DEFAULT_FETCH_TRAINER),
  fetchPokemons: () => Promise.resolve(DEFAULT_FETCH_POKEMONS)
});