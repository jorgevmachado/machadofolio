import React, { useMemo, useState } from 'react';

import { initials } from '@repo/services';

import { Image, Text } from '../../elements';
import { joinClass, type TContext, type TSimplySIze } from '../../utils';

import './Avatar.scss';

export interface AvatarProps {
  src?: string;
  size?: TSimplySIze;
  name: string;
  title?: string;
  context?: TContext;
  className?: string;
  initialsLength?: number;
  hasNotification?: boolean;
}

export default function Avatar({
    src,
    size = 'medium',
    name,
    title,
    context = 'primary',
    className,
    initialsLength = 3,
    hasNotification,
}: AvatarProps)  {

    const [isImageLoaded, setImageLoaded] = useState<boolean>(true);

    const initialsName = useMemo(() => {
        return initials(name, initialsLength);
    }, [name, initialsLength]);

    const handleImageError = () => {
        setImageLoaded(false);
    }

    const classNameList = joinClass([
        size && `ds-avatar__size--${size}`,
    ]);

    const wrapperClassNameList = joinClass([
        'ds-avatar__wrapper',
        context && `ds-avatar__wrapper--context-${context}`,
    ]);

    const imageClassNameList = joinClass([
        'ds-avatar__img',
        isImageLoaded && 'ds-avatar__img--loaded',
        className
    ]);

  return (
      <div className="ds-avatar" data-testid="ds-avatar">
          <div className={classNameList} data-testid="ds-avatar-content">
              <div className={wrapperClassNameList} data-testid="ds-avatar-wrapper">
                  <Image
                      id="ds-avatar-img"
                      src={src}
                      alt={name}
                      fallback={(
                          <Text id="ds-avatar-initials" tag="span" color="neutral-100" data-testid="ds-avatar-initials">
                            {initialsName}
                          </Text>
                      )}
                      onError={handleImageError}
                      className={imageClassNameList}
                      data-testid="ds-avatar-image"
                  />
                  {hasNotification && (
                      <span className="ds-avatar__wrapper--notification" data-testid="ds-avatar-notification"/>
                  )}
              </div>
          </div>
          {title && (
              <div className="ds-avatar__title">
                  <Text id="ds-avatar-title" color={`${context}-100`} variant="medium" data-testid="ds-avatar-title">
                      {title}
                  </Text>
              </div>
          )}
      </div>
  );
};
