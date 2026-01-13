import { useContext } from 'react';

import { PokemonContext } from './PokemonContext';

export default function usePokemon() {
  return useContext(PokemonContext);
}