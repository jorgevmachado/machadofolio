import React, { useEffect, useState } from 'react';

import { isObject } from '@repo/services';

import {
    type TColors,
    type TVariant,
    type TWeight,
    formattedText,
    generateComponentId,
    isReactNode,
    joinClass
} from '../../utils';

import './Text.scss';

interface TextProps extends React.HTMLProps<Element> {
    tag?: string;
    color?: TColors;
    weight?: TWeight;
    variant?: TVariant;
    htmlFor?: string;
    children: React.ReactNode | string;
    'data-testid'?: string;
}

export default function Text({
    id,
    tag = 'p',
    color = 'neutral-80',
    weight = 'regular',
    variant = 'regular',
    htmlFor,
    children,
    className,
    'data-testid': dataTestId = 'ds-text',
    ...props
}: TextProps) {
    const CustomTag = tag as React.ElementType;

    const [componentId, setComponentId] = useState<string | undefined>(id);
    useEffect(() => {
        if (!id) {
            setComponentId(generateComponentId('ds-text'));
        }
    }, [id]);

    const tagProps = CustomTag === 'label' ? { htmlFor } : {};

    const text =
        isReactNode(children) || isObject(children)
            ? children
            : formattedText(children as string);

    return (
        <CustomTag
            id={componentId}
            data-testid={dataTestId}
            className={joinClass([
                'ds-text',
                `ds-color-${color}`,
                `ds-text__variant--${variant}`,
                `ds-text__weight--${weight}`,
                className,
            ])}
            {...props}
            {...tagProps}
        >
            {text || children}
        </CustomTag>
    );
};
