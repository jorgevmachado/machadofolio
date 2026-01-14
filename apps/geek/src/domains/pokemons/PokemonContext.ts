import React from 'react';

import {
  type Paginate ,
  type Pokemon ,
  type QueryParameters,
} from '@repo/business';

export type PokemonContextProps = {
  pokemons: Array<Pokemon>;
  fetchOne: (name: string, updateList?: boolean) => Promise<Pokemon | undefined>;
  isLoading: boolean;
  totalPages: number;
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

export const PokemonContext = React.createContext<PokemonContextProps>({
  pokemons: [],
  fetchOne: () => Promise.resolve(undefined),
  isLoading: false,
  totalPages: 0,
  fetchPokemons: () => Promise.resolve(DEFAULT_FETCH_POKEMONS)
});