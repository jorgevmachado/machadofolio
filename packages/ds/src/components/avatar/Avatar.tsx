import React, { useMemo, useState } from 'react';

import { initials } from '@repo/services';

import { Image, Text } from '../../elements';
import {
  generateComponentId ,
  joinClass ,
  type TContext ,
  type TSimplySIze,
} from '../../utils';

import './Avatar.scss';

export interface AvatarProps {
  id?: string;
  src?: string;
  size?: TSimplySIze;
  name: string;
  width?: string | number;
  title?: string;
  height?: string | number;
  context?: TContext;
  textSize?: string | number;
  className?: string;
  completeName?: boolean;
  initialsLength?: number;
  hasNotification?: boolean;
}

export default function Avatar({
    id,
    src,
    size = 'medium',
    name,
    width,
    title,
    height,
    context = 'primary',
    textSize,
    className,
    completeName = false,
    initialsLength = 3,
    hasNotification,
}: AvatarProps)  {

    const [isImageLoaded, setImageLoaded] = useState<boolean>(true);

    const initialsName = useMemo(() => {
      if(completeName) {
        return name;
      }
        return initials(name, initialsLength);
    }, [completeName, name, initialsLength]);

    const handleImageError = () => {
        setImageLoaded(false);
    }

  const componentId = id ?? generateComponentId('ds-avatar');

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

    const customSize = useMemo(() => {
      const style: React.CSSProperties = {};

      if(width) {
        style['width'] = width;
      }
      if(height) {
        style['height'] = height;
      }
      return style;
    }, [height, width])

  return (
      <div id={componentId} className="ds-avatar" data-testid="ds-avatar">
          <div className={classNameList} data-testid="ds-avatar-content" style={customSize}>
              <div className={wrapperClassNameList} data-testid="ds-avatar-wrapper">
                  <Image
                      id="ds-avatar-img"
                      src={src}
                      alt={name}
                      fallback={(
                          <Text
                            id="ds-avatar-initials"
                            tag="span"
                            color="neutral-100"
                            style={textSize ? { fontSize: textSize } : {}}
                            data-testid="ds-avatar-initials"
                          >
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
