'use client';
import React from 'react';

import { type Pokemon } from '@repo/business';

import { GeekCard } from '../index';

import './PokemonList.scss';

type PokemonListProps = {
  onClick?: (pokemon: Pokemon) => void;
  pokemons: Array<Pokemon>;
};

export default function PokemonList({ pokemons, onClick }: PokemonListProps) {

  return (
    <div className="pokemon-list">
      <section className="pokemon-list__cards">
        { pokemons.map((pokemon) => (
          <GeekCard pokemon={pokemon} key={pokemon.id} onClick={onClick}/>
        ))}
      </section>
    </div>
  );
}