import React from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '../../../elements';

import type { ChartTooltipParams } from '../types';

type ChartTooltipProps = ChartTooltipParams;

import './ChartTooltip.scss';

export default function ChartTooltip({
    active,
    payload,
    countText = 'Count',
    valueText = 'Value',
    percentageText = 'Percentage',
}: ChartTooltipProps) {
    if(active && payload && payload.length) {
        const currentPayload = payload[0];
        const data = currentPayload?.payload || {} as Record<string, string | number>;
        const value = Number(data?.value) || 0;
        const percentageTotal = Number(data?.percentageTotal) || 0;
        const percentage = !data.percentageTotal ? undefined : ((value / percentageTotal) * 100).toFixed(1);
        return (
            <div className="ds-chart-tooltip" data-testid="ds-chart-tooltip">
                <Text variant="small" weight="bold" color="neutral-100" data-testid="ds-chart-tooltip-name">
                    {data.name}
                </Text>
                {data.value && (
                    <Text variant="small" color="neutral-80" data-testid="ds-chart-tooltip-value">
                        {valueText}: {currencyFormatter(data.value)}
                    </Text>
                )}

                {data.count && (
                    <Text variant="small" color="neutral-80" data-testid="ds-chart-tooltip-count">
                        {countText}: {data.count}
                    </Text>
                )}
                {percentage && (
                    <Text variant="small" color="neutral-80" data-testid="ds-chart-tooltip-percentage">
                        {percentageText}: {percentage}%
                    </Text>
                )}
            </div>
        )
    }
    return null;
}