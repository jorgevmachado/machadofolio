import React, { useMemo } from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '../../../../../elements';
import type { TextTooltipProps } from '../../../types';

export default function TextTooltip({
                                        type,
                                        text,
                                        dataName,
                                        appendText,
                                        withCurrencyFormatter = false,
                                        ...props
                                    }: TextTooltipProps) {
    const textProps = { ...props };
    const label = useMemo(() => {
        const currentLabel = withCurrencyFormatter ? currencyFormatter(dataName) : dataName;
        if (text && appendText) {
            return `${text}: ${currentLabel} ${appendText}`;
        }

        if (text && !appendText) {
            return `${text}: ${currentLabel}`;
        }

        if (!text && appendText) {
            return `${currentLabel} ${appendText}`;
        }

        return currentLabel;

    }, [dataName, withCurrencyFormatter, text, appendText]);

    return (
        <Text {...textProps} data-testid={`ds-chart-content-tooltip-${type}`}>
            {label}
        </Text>
    )
}