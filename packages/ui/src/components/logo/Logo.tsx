import React from 'react';

import { Image, joinClass } from '@repo/ds';

import './Logo.scss';

type ImageProps = React.ComponentProps<typeof Image>;

type DivProps = React.HTMLAttributes<HTMLDivElement>

type LogoProps = DivProps & ImageProps;

export default function Logo({
    src,
    alt,
    fit,
    title,
    width = '150',
    height = '150',
    className,
    ...props
}: LogoProps) {
    return (
        <div
            {...props}
            role="button"
            className={joinClass(['ui-logo', className])}
            data-testid="ui-logo"
        >
            <Image
                src={src}
                alt={alt}
                fit={fit}
                type="brand"
                title={title}
                width={width}
                height={height}
            />
        </div>
    );
};
