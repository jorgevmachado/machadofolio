import React from 'react';

import { LabelProps } from 'recharts';

type LabelListComponentProps = LabelProps & {
    fillText?: string
}

export default function LabelListContent({x, y, fill, width, value, fillText }: LabelListComponentProps ) {
    if(x == null || y == null || width == null) {
        return null;
    }

    const radius = 10;

    return (
        <g data-testid="ds-bar-chart-label-list-content">
            <circle cx={Number(x) + Number(width) / 2} cy={Number(y) - radius} r={radius} fill={fill} data-testid="ds-bar-chart-label-list-content-circle" />
            <text
                x={Number(x) + Number(width) / 2}
                y={Number(y) - radius}
                fill={fillText || '#fff'}
                textAnchor="middle"
                data-testid="ds-bar-chart-label-list-text"
                dominantBaseline="middle"
            >
                {String(value).split(' ')[1]}
            </text>
        </g>
    )
}