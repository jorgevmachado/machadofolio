import React, { useCallback, useEffect, useState } from 'react';

import { urlToBase64 } from '@repo/services';

import LAW_LOGO from '../../assets/logo/law.png'
import GEEK_LOGO from '../../assets/logo/geek.png'
import FINANCE_LOGO from '../../assets/logo/finance.png'
import NOTFOUND_IMAGE from '../../assets/danger/notfound.png'

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
    const [isInvalid, setIsInvalid] = useState<boolean>(!src);
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

    const handleBrandSrc = async () => {
        const brand = useActiveBrand();
        switch (brand) {
            case 'law':
                return await urlToBase64(LAW_LOGO);
            case 'finance':
                return await urlToBase64(FINANCE_LOGO);
            case 'geek':
                return urlToBase64(GEEK_LOGO);
            default:
                return urlToBase64(NOTFOUND_IMAGE);
        }
    }

    const handleCurrentSrc = async (type: TImage) => {
        switch (type) {
            case 'brand':
                return await handleBrandSrc();
            case 'notfound':
                return await urlToBase64(NOTFOUND_IMAGE);
            case 'standard':
            default:
                return;

        }
    }

    const handleSrc = async (type: TImage, src?: string) => {
        const currentSrc = src ?? await handleCurrentSrc(type);
        if(!currentSrc) {
            throw new Error('Image src is required');
        }
        return currentSrc;
    }

    useEffect(() => {
        handleSrc(type, src)
            .then((response) => {
                setCurrentSrc(response);
            })
            .catch(() => {
                setIsInvalid(true);
            })
    }, [src]);

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
