import React, { useMemo } from 'react';

import { PieLabelRenderProps } from 'recharts';

import { convertToNumber } from '@repo/services';

type CustomizeLabelProps = PieLabelRenderProps;

const RADIAN = Math.PI / 180;

export default function CustomizeLabel(props: CustomizeLabelProps) {

    const label = useMemo(() => {
        const { cx, cy, percent, midAngle, innerRadius, outerRadius } = props;

        const label = {
            cx: convertToNumber(cx),
            cy: convertToNumber(cy),
            percent: convertToNumber(percent, 1),
            midAngle: convertToNumber(midAngle),
            innerRadius: convertToNumber(innerRadius),
            outerRadius: convertToNumber(outerRadius),
        };

        const radius = label.innerRadius + (label.outerRadius - label.innerRadius) * 0.5;

        const x = label.cx + radius * Math.cos(-(label.midAngle) * RADIAN);
        const y = label.cy + radius * Math.sin(-(label.midAngle) * RADIAN);

        return {
            x,
            y,
            percent: label.percent,
            textAnchor: x > label.cx ? 'start' : 'end',
        };
    }, [props]);

    const { x, y, percent, textAnchor } = label;


    return (
        <text x={x} y={y} fill="white" textAnchor={textAnchor} dominantBaseline="central" data-testid="ds-pie-chart-customize-label-text">
            {`${((percent) * 100).toFixed(0)}%`}
        </text>
    );
}