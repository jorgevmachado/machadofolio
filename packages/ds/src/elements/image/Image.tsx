import React, { useCallback, useEffect, useState } from 'react';

import { type TImage,type TImageSource, useImageSrc } from '../../hooks';
import { joinClass } from '../../utils';

import { Icon } from '../icon';

import './Image.scss';

type TFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

interface ImageProps extends React.ImgHTMLAttributes<Element> {
    fit?: TFit;
    type?: TImage;
    source?: TImageSource;
    lazyLoad?: boolean;
    fallback?: React.ReactNode;
    nameQueryUrl?: string;
    'data-testid'?: string;
}

export default function Image({
    alt,
    fit,
    src,
    type = 'standard',
    source,
    loading,
    onError: onErrorCallback,
    lazyLoad,
    fallback,
    className,
    nameQueryUrl,
    'data-testid': dataTestId = 'ds-image',
    ...props
}: ImageProps) {
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

    const imageSrc = useImageSrc({ type, source, nameQueryUrl });

    useEffect(() => {
        if(!src) {
            setIsInvalid(true);
            if(imageSrc) {
                setIsInvalid(false);
            }
            setCurrentSrc(imageSrc);
            return;
        }

    }, [imageSrc, src, type]);

    const onError = useCallback<React.ReactEventHandler<HTMLImageElement>>(
        (event) => {
            setIsInvalid(true);
            return onErrorCallback?.(event);
        },
        [setIsInvalid, onErrorCallback],
    );

    const classNameList = joinClass([
        'ds-image',
        fit && `ds-image__fit-${fit}`,
        className,
    ]);

    return (isInvalid && fallback)
        ? (
            <div
                title={alt}
                className="ds-image__fallback"
                data-testid={`${dataTestId}-fallback`}
                aria-label={alt ?? 'Image failed to load'}
            >
                { typeof fallback === 'boolean'
                    ? ( <Icon icon="camera" size="2rem" className="ds-image__fallback--icon"/> )
                    : ( fallback )
                }
            </div>
        )
        : (
        <img
            {...props}
            alt={alt}
            src={currentSrc}
            onError={onError}
            loading={loading ?? (lazyLoad ? 'lazy' : undefined)}
            className={classNameList}
            data-testid={dataTestId}
        />
    );
};
