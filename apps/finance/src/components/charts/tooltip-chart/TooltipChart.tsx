'use client';
import React from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '@repo/ds';

import type { DataItemProps, TooltipProps } from '../types';

import './TooltipChart.scss';

export default function TooltipChart({ active, payload, countText = 'Count', valueText = 'Value', percentageText = 'Percentage' }: TooltipProps) {
    if( active && payload && payload.length ) {
        const currentPayload = payload[0];
        const data = currentPayload?.payload || {} as DataItemProps;
        const percentage = !data.percentageTotal ? undefined : ((data.value / data.percentageTotal) * 100).toFixed(1);
        return (
            <div className="tooltip-chart">
                <Text variant="small" weight="bold" color="neutral-100">
                    {data.name}
                </Text>
                <Text variant="small" color="neutral-80">
                    {valueText}: {currencyFormatter(data.value)}
                </Text>
                {data.count && (
                    <Text variant="small" color="neutral-80">
                        {countText}: {data.count}
                    </Text>
                )}
                {percentage && (
                    <Text variant="small" color="neutral-80">
                        {percentageText}: {percentage}%
                    </Text>
                )}
            </div>
        )
    }
    return null;
}