'use client';
import React ,{ useEffect ,useRef ,useState } from 'react';

import { useParams ,useRouter } from 'next/navigation';

import { capitalize ,normalize } from '@repo/services';

import { type Pokemon } from '@repo/business';

import { PageHeader ,useAlert } from '@repo/ui';

import { usePokemon } from '../../../domains';

export default function PokemonsDetailsPage() {
  const router = useRouter();
  const isMounted = useRef(false);
  const params = useParams();
  const name = params['name'] as string;

  const { addAlert } = useAlert();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const { fetchOne } = usePokemon();
  
  const fetch = async () => {
    fetchOne(name, false).then((response) => {
      if (!response) {
        addAlert({ type: 'error', message: 'try again later' });
        router.push('/pokemons');
        return;
      }
      setPokemon(response);
    }).catch(() => {
      addAlert({ type: 'error', message: 'try again later' });
      router.push('/pokemons');
    });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetch().then();
    }
  }, []);

  return (
    <>
      <PageHeader resourceName={normalize(capitalize(name))} />
      {!pokemon ? (
        <div>NOT HAVE</div>
      ) : (
        <div>HAVE</div> 
      )}
    </>
  );
}