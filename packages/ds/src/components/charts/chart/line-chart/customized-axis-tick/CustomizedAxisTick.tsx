import React from 'react';

import type { CustomAxisTickParams } from '../types';

type CustomizedAxisTickProps = CustomAxisTickParams;

export default function CustomizedAxisTick({ x, y, payload, customAxisTick }: CustomizedAxisTickProps) {
    const dy = customAxisTick?.dy || 16;
    const fill = customAxisTick?.fill || '#666';
    const textX = customAxisTick?.x || 0;
    const textY = customAxisTick?.y || 0;
    const transform = customAxisTick?.transform || 'rotate(-35)';
    const textAnchor = customAxisTick?.textAnchor || 'end';
    return (
        <g transform={`translate(${x},${y})`} data-testid="ds-line-chart-customized-axis-tick">
            <text
                x={textX}
                y={textY}
                dy={dy}
                fill={fill}
                transform={transform}
                textAnchor={textAnchor}
                data-testid="ds-line-chart-customized-axis-tick-text"
            >
                {payload.value}
            </text>
        </g>
    );
}