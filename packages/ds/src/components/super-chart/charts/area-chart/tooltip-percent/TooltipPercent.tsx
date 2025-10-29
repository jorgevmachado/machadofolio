import { TooltipContentProps } from 'recharts';

import { getPercentValue } from '@repo/services';

import React from 'react';

import './TooltipPercent.scss';

export default function TooltipPercent({ label, payload }: TooltipContentProps<number | string, string>) {
    const total = payload.reduce((result, entry) => result + entry.value, 0);

    return (
        <div className="ds-area-chart-tooltip-percent" data-testid="ds-area-chart-tooltip-percent">
            <h3 data-testid="ds-area-chart-tooltip-percent-text">{`${label} (Total: ${total})`}</h3>
            <ul data-testid="ds-area-chart-tooltip-percent-list">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} style={{ color: entry.color }} data-testid={`ds-area-chart-tooltip-percent-list-item-${index}`}>
                        {`${entry.name}: ${entry.value} (${getPercentValue(entry.value, total)})`}
                    </li>
                ))}
            </ul>
        </div>
    );
};
