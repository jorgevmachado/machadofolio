import React from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '../../../elements';

import type { ChartTooltipProps, DataChartItem } from '../types';

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
        const data = currentPayload?.payload || {} as DataChartItem;
        const percentage = !data.percentageTotal ? undefined : ((data.value / data.percentageTotal) * 100).toFixed(1);
        return (
            <div className="ds-chart-tooltip" data-testid="ds-chart-tooltip">
                <Text variant="small" weight="bold" color="neutral-100" data-testid="ds-chart-tooltip-name">
                    {data.name}
                </Text>
                <Text variant="small" color="neutral-80" data-testid="ds-chart-tooltip-value">
                    {valueText}: {currencyFormatter(data.value)}
                </Text>
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