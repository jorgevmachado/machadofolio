'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { PageHeader } from '@repo/ui';

import type { Pokemon } from '@repo/business';

import PokemonList from '../../components/pokemon-list';
import { usePokemon } from '../../domains';

import './page.scss';

export default function PokemonsPage() {
  const router = useRouter();
  const { pokemons ,fetchOne ,isLoading } = usePokemon();

  const handleOnClick = async (pokemon: Pokemon) => {
    if (pokemon.status === 'COMPLETE') {
      router.push(`/pokemons/${ pokemon.name }`);
      return;
    }
    await fetchOne(pokemon.name);
  };

  return isLoading ? null : (
    <>
      <PageHeader resourceName="Pokemons"/>
      <PokemonList pokemons={pokemons} onClick={handleOnClick}/>
    </>
  );
}