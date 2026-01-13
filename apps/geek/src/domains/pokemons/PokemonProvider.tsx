import React ,{ useEffect ,useRef } from 'react';

import { useLoading } from '@repo/ui';

import { PokemonContext ,type PokemonContextProps } from './PokemonContext';

export default function PokemonProvider( { children } : React.PropsWithChildren) {
  const isMounted = useRef(false);

  const { show, hide } = useLoading();

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
  }, []);
  
  const context: PokemonContextProps = {};

  return (
    <PokemonContext.Provider value={context}>
      {children}
    </PokemonContext.Provider>
  );
}