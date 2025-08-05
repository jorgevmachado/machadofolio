import React from 'react';

import { Image, joinClass } from '@repo/ds';

import './Logo.scss';

type ImageProps = React.ComponentProps<typeof Image>;

type DivProps = React.HTMLAttributes<HTMLDivElement>

type LogoProps = DivProps & ImageProps;

export default function Logo({
    src = 'https://placehold.co/150',
    alt,
    fit,
    title,
    width,
    height,
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
                title={title}
                width={width}
                height={height}
            />
        </div>
    );
};
