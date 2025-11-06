import React from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '../../../../elements';

import type { TextProps } from '../../types';

type GenericTextTooltipProps =  {
    data: Record<string, string | number>;
    genericTextProps?: TextProps;
};

export default function GenericTextTooltip({ data, genericTextProps }: GenericTextTooltipProps) {
    const textProps = {...genericTextProps};
    const { withCurrencyFormatter, ...props } = textProps;

    const list = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: withCurrencyFormatter ? currencyFormatter(value) : value,
    }));

    return  list.map(({ name, value }, index) => (
        <Text {...props} key={`name-${index}`} data-testid={`ds-chart-tooltip-${name}-generic`}>
            {name}: {value}
        </Text>
    ))
}