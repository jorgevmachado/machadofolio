import React, { useEffect, useState } from 'react';

import { isObject } from '@repo/services';

import { TranslatorFunction } from '@repo/i18n';

import {
    type TColors,
    type TVariant,
    type TWeight,
    formattedText,
    generateComponentId,
    isReactNode,
    joinClass,
    translateValue
} from '../../utils';

import './Text.scss';

interface TextProps extends React.HTMLProps<Element> {
    tag?: string;
    color?: TColors;
    weight?: TWeight;
    variant?: TVariant;
    htmlFor?: string;
    children: React.ReactNode | string;
    textsToTranslate?: Array<string>;
    translator?: TranslatorFunction;
    'data-testid'?: string;
}

export default function Text({
                                 id,
                                 tag = 'p',
                                 name,
                                 color = 'neutral-80',
                                 weight = 'regular',
                                 variant = 'regular',
                                 htmlFor,
                                 children,
                                 className,
                                 translator,
                                 textsToTranslate,
                                 'data-testid': dataTestId = 'ds-text',
                                 ...props
                             }: TextProps) {
    const CustomTag = tag as React.ElementType;

    const [componentId, setComponentId] = useState<string | undefined>(id);
    const [value, setValue] = useState<unknown>(children);

    const tagProps = CustomTag === 'label' ? { htmlFor } : {};

    useEffect(() => {
        if (!id) {
            setComponentId(generateComponentId('ds-text'));
        }
    }, [id]);

    useEffect(() => {
        const displayValue = (isReactNode(children) || isObject(children))
            ? children
            : (() => {
                const formatted = formattedText(children as string);
                return formatted !== undefined ? formatted : children;
            })();

        if (translator) {
            const translated = translateValue(displayValue, name, translator, textsToTranslate);
            setValue(translated);
            return;
        }
        setValue(displayValue);
    }, [children, translator, name, textsToTranslate]);

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
            {value}
        </CustomTag>
    );
};