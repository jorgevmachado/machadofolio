import React, { useMemo } from 'react';

import {
    Area,
    AreaChart as AreaChartComponent,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { curveCardinal } from 'd3-shape';

import { convertToPercent } from '@repo/services';

import type { XAxisProps, YAxisProps } from '../../types';
import { getRandomHarmonicPalette } from '../../colors';

import type { AreaChartProps } from './types';
import TooltipPercent from './tooltip-percent';
import LinearGradient from './linear-gradient';

const defaultStyle = {
    width: '100%',
    maxWidth: '700px',
    maxHeight: '70vh',
    aspectRatio: 1.618
}

const defaultMargin = {
    top: 20,
    left: 0,
    right: 0,
    bottom: 0
}

export default function AreaChart ({
    xAxis,
    yAxis,
    areas,
    style,
    margin,
    syncId,
    labels = [],
    withXAxis = true,
    withYAxis = true,
    responsive,
    stackOffset,
    withTooltip = true,
    linearGradient,
    tooltipContent,
    withPercentFormatter
}: AreaChartProps) {
    const list = useMemo(() => {
        const { fill, stroke } = getRandomHarmonicPalette()
        return labels?.map((label) => {
            const type = !label?.curveCardinalTension
                ? label.type
                : curveCardinal.tension(label?.curveCardinalTension);

            return {
                ...label,
                type,
                fill: label?.fill || fill,
                stroke: label?.stroke || stroke,
            }
        });
    }, [labels]);

    const currentStyle = useMemo(() => {
        return { ...defaultStyle, ...style }
    }, [style]);

    const currentMargin = useMemo(() => {
        return { ...defaultMargin, ...margin }
    }, [margin]);

    const axis = useMemo(() => {
        const x: XAxisProps = !xAxis ? { dataKey: 'name' } : xAxis;

        const y: YAxisProps = !yAxis ? { width: 'auto' } : yAxis;

        if(withPercentFormatter) {
            y.tickFormatter = (value) => convertToPercent(value);
        }

        return { x, y }
    }, [xAxis, yAxis, withPercentFormatter]);

    return (
        <AreaChartComponent
            data={areas}
            style={currentStyle}
            syncId={syncId}
            margin={currentMargin}
            responsive={responsive}
            stackOffset={stackOffset}
        >
            <CartesianGrid strokeDasharray="3 3" />

            {withXAxis && (
                <XAxis {...axis.x} />
            )}

            {withYAxis && (
                <YAxis {...axis.y} />
            )}
            
            {withTooltip && (
                <Tooltip content={withPercentFormatter ? TooltipPercent : tooltipContent}/>
            )}

            {linearGradient && (
                <LinearGradient {...linearGradient} areas={areas}/>
            )}

            {list?.map((label, index) => (
                <Area
                    key={`${label.key}-${index}`}
                    fill={label?.fill}
                    type={label.type}
                    stroke={label?.stroke}
                    dataKey={label.dataKey}
                    stackId={label.stackId}
                    data-testid={`ds-area-chart-area-${index}`}
                />
            ))}
        </AreaChartComponent>
    )

}