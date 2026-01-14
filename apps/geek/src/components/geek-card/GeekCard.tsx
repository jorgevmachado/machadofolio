'use client';
import React ,{ useCallback ,useMemo ,useState } from 'react';

import { capitalize ,normalize } from '@repo/services';

import { Avatar ,Button ,Card ,Image ,joinClass ,Text } from '@repo/ds';

import { type GeekCardField } from './types';

import './GeekCard.scss';

type ButtonProps = React.ComponentProps<typeof Button>;
type TextProps = React.ComponentProps<typeof Text>;
type AvatarProps = React.ComponentProps<typeof Avatar>;

type GeekCardProps = {
  title: Omit<TextProps, 'children'> & { value: string};
  fields?: Array<GeekCardField>;
  avatar?: Partial<AvatarProps>;
  images?: Array<string>;
  button?: Omit<ButtonProps, 'children' & { value: string}>;
};


export default function GeekCard({
  title,
  fields = [],
  avatar,
  images = [],
  button,
}: GeekCardProps) {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const hasImages = Array.isArray(images) && images.length > 0;
  const hasCarousel = hasImages && images.length > 1;
  const hasAvatar = Boolean(avatar) && !hasCarousel;
  const showAvatar = hasAvatar ?? hasImages;

  const handlePrev = useCallback(() => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const textProps = useMemo(() => {
    const text: TextProps = {
      tag: 'h2',
      color: 'neutral-100',
      weight: 'bold',
      variant: 'large',
      children: normalize(capitalize(title.value)),
      className: 'geek-card__title',
    };
    return text;
  }, [title.value]);

  const fieldsProps = useMemo(() => {
    const hasFields = Array.isArray(fields) && fields.length > 0;
    if (!fields && !hasFields) {
      return [];
    }
    const defaultText: TextProps = {
      tag: 'span',
      color: 'neutral-100',
      children: 'text'
    };
    return fields?.map(({ label, value }) => {
      const textLabel: TextProps = {
        ...defaultText,
        weight: 'bold',
        children: label,
      };
      const textValue: TextProps = {
        ...defaultText,
        children: value,
      };
      return { label: textLabel, value:textValue };
    });
  }, [fields]);
  
  const buttonProps = useMemo(() => {
    if (!button) {
      return;
    }
    const { value, ...props } = button;
    const action: ButtonProps = {
      context: 'primary',
      children: value,
      className: joinClass([
        'geek-card__button',
        !fieldsProps || fieldsProps?.length === 0 && 'geek-card__button--no-fields',
      ]),
      ...props,
    };
    return action;
  }, [button, fieldsProps]);

  const avatarProps = useMemo(() => {
    const props: AvatarProps = {
      id:'avatar-image',
      src: images[0],
      size:'large',
      name: title.value,
    };
    if (!avatar) {
      return props;
    }
    return {
      ...props,
      ...avatar,
    };
  }, [avatar, images, title.value]);

  const classNameList = joinClass([
    'geek-card',
    !fieldsProps || fieldsProps?.length === 0 && 'geek-card__no-fields',
  ]);
  
  return (
    <Card className={classNameList}>
      <Text {...textProps}/>
      {hasImages && hasCarousel && (
        <div className="geek-card__carousel">
          <Button onClick={handlePrev}>{'<'}</Button>
          <Image src={images[currentImage]} className="geek-card__carousel--image"/>
          <Button onClick={handleNext}>{'>'}</Button>
        </div>
      )}
      {showAvatar && (
        <Avatar {...avatarProps}/>
      )}
      { fieldsProps && fieldsProps?.length > 0 && (
        <div className="geek-card__fields">
          {fieldsProps?.map((field, idx) => (
            <React.Fragment key={idx}>
              <div className="geek-card__fields--item">
                <Text {...field.label} />
              </div>
              <div className="geek-card__fields--item">
                <Text {...field.value} />
              </div>
            </React.Fragment>
          ))}
        </div>
      ) }
      {buttonProps && (
        <Button {...buttonProps} />
      )}
    </Card>
  );
}