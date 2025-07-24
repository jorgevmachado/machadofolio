import React from 'react';

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
    ...props
}: TextProps) {
    const CustomTag = tag as React.ElementType;

    const componentId = id ? id : generateComponentId('ds-text');

    const tagProps = CustomTag === 'label' ? { htmlFor } : {};

    const text =
        isReactNode(children) || isObject(children)
            ? children
            : formattedText(children as string);

    return (
        <CustomTag
            id={componentId}
            data-testid="ds-text"
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
