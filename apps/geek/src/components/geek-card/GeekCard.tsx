'use client';
import React ,{ useCallback ,useMemo ,useState } from 'react';

import { useRouter } from 'next/navigation';

import { capitalize ,normalize } from '@repo/services';

import { type Pokemon } from '@repo/business';

import { Avatar ,type Button ,Card ,Image ,joinClass ,Text } from '@repo/ds';

import { type GeekCardField } from './types';

import './GeekCard.scss';

type AvatarProps = React.ComponentProps<typeof Avatar>;

type GeekCardProps = {
  avatar?: Partial<AvatarProps>;
  onClick?: (pokemon: Pokemon) => void;
  pokemon: Pokemon;
};

export default function GeekCard({
  avatar,
  pokemon,
  onClick,
}: GeekCardProps) {


  const avatarProps = useMemo(() => {
    const props: AvatarProps = {
      id:'avatar-image',
      src: pokemon?.external_image ?? pokemon.image,
      size:'large',
      name: pokemon?.name,
      width: '9rem',
      height: '9rem',
      textSize: '1.5rem',
      completeName: true
    };
    if (!avatar) {
      return props;
    }
    return {
      ...props,
      ...avatar,
    };
  }, [avatar, pokemon?.external_image, pokemon.image, pokemon?.name]);
  
  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>, pokemon: Pokemon) => {
    e.preventDefault();
    onClick?.(pokemon);
  };

  const classNameList = joinClass(['geek-card']);
  
  return (
    <Card className={classNameList} style={ onClick ?{ cursor: 'pointer' } : {}} onClick={(e) => handleOnClick(e, pokemon)}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          { pokemon.status === 'COMPLETE' ? (
            <Image
              id="ds-avatar-img"
              src={pokemon.image}
              alt={pokemon.name}
              fit="cover"
              style={{ width: '150px', height: '150px', borderRadius: '8px' }}
              fallback={(
                <Text id="ds-avatar-initials" tag="span" color="neutral-100" data-testid="ds-avatar-initials">
                  {pokemon.name}
                </Text>
              )}
              className={joinClass(['geek-card__img'])}
            />
          ) : (
            <Avatar {...avatarProps} context="neutral"/>
          )}
        </div>
        <Text tag="h5">Order:{pokemon.order}</Text>
        {pokemon.capture_rate !== 0 && (
          <Text tag="h5">Capture Rate:{pokemon.capture_rate}</Text>
        )}
        <Text tag="h5">{pokemon.name}</Text>
        {pokemon?.types && pokemon?.types?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {pokemon.types.map((type) => (
              <div
                key={type.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: type.background_color,
                  borderRadius: 8,
                  marginBottom: 8,
                  minWidth: 80,
                  padding: '4px 12px',
                }}
              >
                <Text tag="h5" style={{ color: type.text_color }}>{type.name}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}