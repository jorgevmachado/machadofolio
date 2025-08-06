import React, { useCallback, useEffect, useState } from 'react';

import {
    LAW_LOGO_BASE64,
    GEEK_LOGO_BASE64,
    FINANCE_LOGO_BASE64,
    NOTFOUND_IMAGE_BASE64
} from '../../assets/base64';

import { joinClass } from '../../utils';
import { useActiveBrand } from '../../hooks';

import { Icon } from '../icon';

import './Image.scss';

type TImage = 'brand' | 'standard' | 'notfound';

type TFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

interface ImageProps extends React.ImgHTMLAttributes<Element> {
    fit?: TFit;
    type?: TImage;
    lazyLoad?: boolean;
    fallback?: React.ReactNode;
}

export default function Image({
    alt,
    fit,
    src,
    type = 'standard',
    loading,
    onError: onErrorCallback,
    lazyLoad,
    fallback,
    className,
    ...props
}: ImageProps) {
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

    const handleBrandSrc = () => {
        const brand = useActiveBrand();
        switch (brand) {
            case 'law':
                return LAW_LOGO_BASE64;
            case 'finance':
                return FINANCE_LOGO_BASE64;
            case 'geek':
                return GEEK_LOGO_BASE64;
            default:
                return NOTFOUND_IMAGE_BASE64;
        }
    }

    const handleCurrentSrc = (type: TImage) => {
        switch (type) {
            case 'brand':
                return handleBrandSrc();
            case 'notfound':
                return NOTFOUND_IMAGE_BASE64;
            case 'standard':
            default:
                return;

        }
    }

    useEffect(() => {
        if(!src) {
            setIsInvalid(true);
            const base64 = handleCurrentSrc(type);
            if(base64) {
                setIsInvalid(false);
            }
            setCurrentSrc(base64);
            return;
        }

    }, [src, type]);

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
                data-testid="ds-image-fallback"
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
            data-testid="ds-image"
            onError={onError}
            loading={loading ?? (lazyLoad ? 'lazy' : undefined)}
            className={classNameList}
        />
    );
};
