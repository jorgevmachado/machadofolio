import React ,{ useEffect ,useRef ,useState } from 'react';

import {
  type Paginate ,
  type Pokemon ,
  type PokemonTrainer ,
  type QueryParameters,
} from '@repo/business';

import { useAlert ,useLoading ,useUser } from '@repo/ui';

import { pokemonService } from '../../shared';

import { PokemonContext ,type PokemonContextProps } from './PokemonContext';

export default function PokemonProvider( { children } : React.PropsWithChildren) {
  const isMounted = useRef(false);
  const { user } = useUser();
  const { addAlert } = useAlert();
  const { show, hide, isLoading } = useLoading();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [results, setResults] = useState<Array<Pokemon>>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [trainer, setTrainer] = useState<PokemonTrainer | null>(null);

  const fetchPokemons = async ({ page = currentPage, limit = 10, ...props }: QueryParameters) => {
    show();
    try {
      const response = await pokemonService.getAll({ ...props, page, limit, asc: 'order' }) as Paginate<Pokemon>;
      setResults(response.results);
      setTotalPages(response.pages);
      console.log('# => response => results => ', response.results);
      return response;
    } catch (error) {
      addAlert({ type: 'error', message: 'Error Fetching Pokemons' });
      throw error;
    } finally {
      hide();
    }
  };

  const initialize = async (name?: string) => {
    show();
    try {
      const currentTrainer = await pokemonService.initialize(name);
      setTrainer(currentTrainer);
      if (currentTrainer.captured_pokemons && currentTrainer.captured_pokemons.length > 0) {
        const pokemon = currentTrainer.captured_pokemons?.[0]?.pokemon;
        if (pokemon) {
          await fetchOne(pokemon.name, false);
        }
      }
      return currentTrainer;
    } catch (error) {
      addAlert({ type: 'error', message: 'Error initialize' });
      throw error;
    } finally {
      hide();
    }
  };

  const fetchOne = async (name: string, updateList: boolean = true) => {
    show();
    try {
      const response = await pokemonService.get(name);
      if (updateList) {
        const currentResults = [...results];
        const index = currentResults.findIndex((pokemon) => pokemon.name === name);
        currentResults[index] = response;
        setResults(currentResults);  
      }
      return response;
    } catch (error) {
      addAlert({ type: 'error', message: 'Error Fetching Pokemon Details' });
      throw error;
    } finally {
      hide();
    }
  };

  useEffect(() => {
    console.log('# => user => ', user);
    if (!isMounted.current) {
      isMounted.current = true;
      fetchPokemons({ page: currentPage }).then();
    }
  }, []);
  
  const context: PokemonContextProps = {
    pokemons: results,
    fetchOne,
    isLoading,
    initialize,
    totalPages,
    fetchPokemons
  };

  return (
    <PokemonContext.Provider value={context}>
      {children}
    </PokemonContext.Provider>
  );
}