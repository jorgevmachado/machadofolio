import React, { useCallback, useEffect, useState } from 'react';

import { Icon } from '../icon';
import { joinClass } from '../../utils';

import './Image.scss';

interface ImageProps extends React.ImgHTMLAttributes<Element> {
    fit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    lazyLoad?: boolean;
    fallback?: React.ReactNode;
}

export default function Image({
    alt,
    fit,
    loading,
    onError: onErrorCallback,
    lazyLoad,
    fallback,
    className,
    ...props
}: ImageProps) {
    const [isInvalid, setIsInvalid] = useState<boolean>(!props?.src);

    useEffect(() => {
        if(!props?.src) {

            setIsInvalid(true);
        }
    }, [props?.src]);

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

    if (isInvalid && fallback) {
        return (
            <div
                title={alt}
                className="ds-image__fallback"
                aria-label={alt ?? 'Image failed to load'}
            >
                { typeof fallback === 'boolean'
                    ? ( <Icon icon="camera" size="2rem" className="ds-image__fallback--icon"/> )
                    : ( fallback )
                }
            </div>
        );
    }

    return (
        <img
            {...props}
            alt={alt}
            data-testid="ds-image"
            onError={onError}
            loading={loading ?? (lazyLoad ? 'lazy' : undefined)}
            className={classNameList}
        />
    );
};
