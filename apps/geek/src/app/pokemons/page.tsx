'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { PageHeader } from '@repo/ui';

import type { Pokemon } from '@repo/business';

import { GeekCard ,type GeekCardField } from '../../components';
import { usePokemon } from '../../domains';

import './page.scss';

export default function PokemonsPage() {
  const router = useRouter();
  const { pokemons ,fetchOne ,isLoading } = usePokemon();

  const handleOnClick = async (
    e: React.MouseEvent<HTMLButtonElement> ,pokemon: Pokemon
  ) => {
    e.preventDefault();
    if (pokemon.status === 'COMPLETE') {
      router.push(`/pokemons/${ pokemon.name }`);
      return;
    }
    await fetchOne(pokemon.name);
  };

  const buildFields = (pokemon: Pokemon) => {
    const data: Array<GeekCardField> = [];
    if (pokemon.capture_rate) {
      data.push({ label: 'Capture rate' ,value: pokemon.capture_rate });
    }
    if (pokemon.speed) {
      data.push({ label: 'speed' ,value: pokemon.speed });
    }
    if (pokemon.attack) {
      data.push({ label: 'attack' ,value: pokemon.attack });
    }
    if (pokemon.defense) {
      data.push({ label: 'defense' ,value: pokemon.defense });
    }
    if (pokemon.special_attack) {
      data.push({ label: 'Special attack' ,value: pokemon.special_attack });
    }
    if (pokemon.special_defense) {
      data.push({ label: 'Special defense' ,value: pokemon.special_defense });
    }
    return data;
  };
  
  return isLoading ? null : (
    <>
      <PageHeader resourceName="Pokemons" />
      <div className="pokemons">
        <section className="pokemons__cards">
          { pokemons.map((pokemon) => (
            <GeekCard
              key={ pokemon.id }
              title={ { value: pokemon.name } }
              avatar={ {
                id: 'avatar-image' ,
                src: pokemon.image ,
                name: pokemon.name ,
                context: 'error',
              } }
              fields={ buildFields(pokemon) }
              button={ {
                value: pokemon.status === 'COMPLETE' ?
                  'View Details' :
                  'Show More' ,
                onClick: (e) => handleOnClick(e ,pokemon),
              } }
            />
          )) }
        </section>

      </div>
    </>
  );
}