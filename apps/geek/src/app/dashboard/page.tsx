'use client';
import React ,{ useCallback ,useEffect ,useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { type Pokemon } from '@repo/business';

import { PageHeader ,useUser } from '@repo/ui';

import { GeekCard } from '../../components';
import { usePokemon } from '../../domains';

import './page.scss';

export default function DashboardPage() {
  const router = useRouter();
  const { initialize, pokemons, isLoading } = usePokemon();
  const { user } = useUser();
  console.log('# => pokemons => ', pokemons);

  useEffect(() => {
    console.log('# => user => ', user)  ;
  } ,[]);
  
  const catchPokemon = useCallback((pokemons: Array<Pokemon>, order: number) => {
    const pokemon = pokemons.filter((item) => item.order === order)?.[0];
    if (!pokemon) {
      return pokemons[0];
    }
    return pokemon;
  }, []);
  
  const pokemonToCatch = useMemo(() => {
    const results: Array<Pokemon> = [];
    const first = catchPokemon(pokemons, 1);
    if (first) {
      results.push(first);
    }
    const second = catchPokemon(pokemons, 4);
    if (second) {
      results.push(second);
    }
    const third = catchPokemon(pokemons, 7);
    if (third) {
      results.push(third);
    }
    return results;
  }, [catchPokemon, pokemons]);

  const handleOnClick = useCallback( async (pokemon: Pokemon) => {
    await initialize(pokemon.name);
    router.push('/dashboard');
  }, [initialize, router]);

  return (
    <>
      <PageHeader resourceName="DASHBOARD" />
      {!isLoading && (
        <>
          {user.pokemon_trainer ? (
            <h1>UHUUU</h1>
          ) : (
            <section className="dashboard__cards">
              { pokemonToCatch?.map((pokemon) => (
                <GeekCard
                  key={ pokemon.id }
                  pokemon={pokemon}
                  onClick={() => handleOnClick(pokemon)}
                />
              )) }
            </section>
          )}
        </>
      )}
    </>
  );
}