// 'use client';
// // React
// import React, { useEffect, useMemo,useRef, useState } from 'react';
//
// // Next.js
// import { useParams, useRouter } from 'next/navigation';
//
// // Internal libs
// import { capitalize, normalize } from '@repo/services';
//
// // Types
// import { type Pokemon } from '@repo/business';
//
// import { Image } from '@repo/ds';
//
// // UI components
// import { PageHeader, useAlert } from '@repo/ui';
//
// // Domains
// import { usePokemon } from '../../../domains';
//
// const LABELS = {
//   hp: 'HP',
//   attack: 'Attack',
//   defense: 'Defense',
//   speed: 'Speed',
//   special_attack: 'Special Attack',
//   special_defense: 'Special Defense',
//   types: 'Types',
//   abilities: 'Abilities',
//   moves: 'Moves',
//   habitat: 'Habitat',
//   is_baby: 'Baby',
//   is_legendary: 'Legendary',
//   is_mythical: 'Mythical',
//   gender_rate: 'Gender Rate',
//   capture_rate: 'Capture Rate',
//   base_happiness: 'Base Happiness',
//   evolutions: 'Evolutions',
// };
//
// const SKELETON_IMAGE = '/pokeball-skeleton.png'; // Use a pokeball or similar as skeleton
//
// export default function PokemonsDetailsPage() {
//   const router = useRouter();
//   const isMounted = useRef(false);
//   const params = useParams();
//   const name = params['name'] as string;
//
//   const { addAlert } = useAlert();
//
//   const [pokemon, setPokemon] = useState<Pokemon | null>(null);
//   const [loading, setLoading] = useState(true);
//
//   const { fetchOne } = usePokemon();
//
//   const fetch = async () => {
//     setLoading(true);
//     fetchOne(name, false)
//     .then((response) => {
//       if (!response) {
//         addAlert({ type: 'error', message: 'try again later' });
//         router.push('/pokemons');
//         return;
//       }
//       setPokemon(response);
//     })
//     .catch(() => {
//       addAlert({ type: 'error', message: 'try again later' });
//       router.push('/pokemons');
//     })
//     .finally(() => setLoading(false));
//   };
//
//   useEffect(() => {
//     if (!isMounted.current) {
//       isMounted.current = true;
//       fetch();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//
//   const pokemonTypes = useMemo(() => pokemon?.types || [], [pokemon]);
//   const pokemonAbilities = useMemo(() => pokemon?.abilities || [], [pokemon]);
//   const pokemonMoves = useMemo(() => pokemon?.moves || [], [pokemon]);
//   const pokemonEvolutions = useMemo(() => pokemon?.evolutions || [], [pokemon]);
//
//   return (
//     <>
//       <PageHeader resourceName={normalize(capitalize(name))} />
//       {loading ? (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
//           <Image src={SKELETON_IMAGE} alt='Loading skeleton' width={160} height={160} style={{ margin: '24px 0' }} />
//           <div style={{ width: 200, height: 24, background: '#eee', borderRadius: 8, marginBottom: 8 }} />
//           <div style={{ width: 120, height: 16, background: '#eee', borderRadius: 8, marginBottom: 8 }} />
//           <div style={{ width: 180, height: 16, background: '#eee', borderRadius: 8, marginBottom: 8 }} />
//         </div>
//       ) : !pokemon ? (
//         <div style={{ textAlign: 'center', marginTop: 32 }}>Not found</div>
//       ) : (
//         <main style={{ maxWidth: 480, margin: '0 auto', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <Image
//             src={pokemon.image || SKELETON_IMAGE}
//             alt={normalize(capitalize(pokemon.name))}
//             width={180}
//             height={180}
//             style={{ objectFit: 'contain', margin: '16px 0', borderRadius: 16, background: '#f6f6f6' }}
//           />
//           <section style={{ width: '100%', marginBottom: 16 }}>
//             <h2 style={{ fontSize: 20, margin: '8px 0' }}>{normalize(capitalize(pokemon.name))}</h2>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
//               {pokemonTypes.map((type) => (
//                 <span
//                   key={type.name}
//                   style={{
//                     background: type.background_color,
//                     color: type.text_color,
//                     borderRadius: 8,
//                     padding: '2px 10px',
//                     fontSize: 14,
//                   }}
//                   aria-label={`Type: ${type.name}`}
//                 >
//                   {capitalize(type.name)}
//                 </span>
//               ))}
//             </div>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
//               <span><b>{LABELS.hp}:</b> {pokemon.hp ?? '-'}</span>
//               <span><b>{LABELS.attack}:</b> {pokemon.attack ?? '-'}</span>
//               <span><b>{LABELS.defense}:</b> {pokemon.defense ?? '-'}</span>
//               <span><b>{LABELS.speed}:</b> {pokemon.speed ?? '-'}</span>
//               <span><b>{LABELS.special_attack}:</b> {pokemon.special_attack ?? '-'}</span>
//               <span><b>{LABELS.special_defense}:</b> {pokemon.special_defense ?? '-'}</span>
//             </div>
//           </section>
//           <section style={{ width: '100%', marginBottom: 16 }}>
//             <h3 style={{ fontSize: 16, margin: '8px 0' }}>{LABELS.abilities}</h3>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {pokemonAbilities.length === 0 ? <li>-</li> : pokemonAbilities.map((a) => (
//                 <li key={a.name}>{capitalize(a.name)}</li>
//               ))}
//             </ul>
//           </section>
//           <section style={{ width: '100%', marginBottom: 16 }}>
//             <h3 style={{ fontSize: 16, margin: '8px 0' }}>{LABELS.moves}</h3>
//             <ul style={{ paddingLeft: 16, margin: 0, maxHeight: 120, overflowY: 'auto' }}>
//               {pokemonMoves.length === 0 ? <li>-</li> : pokemonMoves.slice(0, 10).map((m) => (
//                 <li key={m.name}>{capitalize(m.name)}</li>
//               ))}
//               {pokemonMoves.length > 10 && <li>+{pokemonMoves.length - 10} more</li>}
//             </ul>
//           </section>
//           <section style={{ width: '100%', marginBottom: 16 }}>
//             <h3 style={{ fontSize: 16, margin: '8px 0' }}>Info</h3>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
//               <span><b>{LABELS.habitat}:</b> {pokemon.habitat ?? '-'}</span>
//               <span><b>{LABELS.is_baby}:</b> {pokemon.is_baby ? 'Yes' : 'No'}</span>
//               <span><b>{LABELS.is_legendary}:</b> {pokemon.is_legendary ? 'Yes' : 'No'}</span>
//               <span><b>{LABELS.is_mythical}:</b> {pokemon.is_mythical ? 'Yes' : 'No'}</span>
//               <span><b>{LABELS.gender_rate}:</b> {pokemon.gender_rate ?? '-'}</span>
//               <span><b>{LABELS.capture_rate}:</b> {pokemon.capture_rate ?? '-'}</span>
//               <span><b>{LABELS.base_happiness}:</b> {pokemon.base_happiness ?? '-'}</span>
//             </div>
//           </section>
//           <section style={{ width: '100%', marginBottom: 16 }}>
//             <h3 style={{ fontSize: 16, margin: '8px 0' }}>{LABELS.evolutions}</h3>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {pokemonEvolutions.length === 0 ? <li>-</li> : pokemonEvolutions.map((e) => (
//                 <li key={e.name}>{capitalize(e.name)}</li>
//               ))}
//             </ul>
//           </section>
//         </main>
//       )}
//     </>
//   );
// }

'use client';
import React ,{ useEffect ,useRef ,useState } from 'react';

import { useParams ,useRouter } from 'next/navigation';

import { capitalize ,normalize } from '@repo/services';

import { type Pokemon } from '@repo/business';

import { Image ,Text } from '@repo/ds';

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
        <div style={{ textAlign: 'center', marginTop: 32 }}>Not found</div>
      ) : (
        <main style={{ maxWidth: 480, margin: '0 auto', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image
            src={pokemon.image}
            alt={normalize(capitalize(pokemon.name))}
            width={180}
            height={180}
            style={{ objectFit: 'contain', margin: '16px 0', borderRadius: 16, background: '#f6f6f6' }}
          />
          <section style={{ width: '100%', marginBottom: 16 }}>
            <Text tag="h2" color="neutral-100" weight="bold" variant="large">{normalize(capitalize(pokemon.name))}</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <Text>{pokemon.hp}</Text>
            </div>
          </section>
        </main>
      )}
    </>
  );
}