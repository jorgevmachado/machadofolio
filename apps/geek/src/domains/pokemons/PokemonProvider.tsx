import React ,{ useEffect ,useRef ,useState } from 'react';

import { useAlert ,useLoading } from '@repo/ui';

import type { Paginate ,Pokemon ,QueryParameters } from '@repo/business';

import { pokemonService } from '../../shared';

import { PokemonContext ,type PokemonContextProps } from './PokemonContext';

export default function PokemonProvider( { children } : React.PropsWithChildren) {
  const isMounted = useRef(false);
  const { addAlert } = useAlert();
  const { show, hide, isLoading } = useLoading();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [results, setResults] = useState<Array<Pokemon>>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

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
    if (!isMounted.current) {
      isMounted.current = true;
      fetchPokemons({ page: currentPage }).then();
    }
  }, []);
  
  const context: PokemonContextProps = {
    pokemons: results,
    fetchOne,
    isLoading,
    totalPages,
    fetchPokemons
  };

  return (
    <PokemonContext.Provider value={context}>
      {children}
    </PokemonContext.Provider>
  );
}