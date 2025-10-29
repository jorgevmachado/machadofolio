import React, { useMemo } from 'react';

import {
    RadarChart as RadarChartComponent,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar, Legend, Tooltip
} from 'recharts';

import { getRandomHarmonicPalette } from '../../colors';

import type { PolarAngleAxisProps, PolarRadiusAxisProps, RadarChartProps } from './types';

const defaultStyle = {
    width: '100%',
    height: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    aspectRatio: 1
}

const defaultMargin = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
}

export default function RadarChart({
    value,
    style,
    margin,
    radars,
    labels = [],
    responsive,
    withLegend = false,
    outerRadius = '80%',
    withTooltip = true,
    polarAngleAxis,
    tooltipContent,
    polarRadiusAxis
}: RadarChartProps) {

    const currentStyle = useMemo(() => {
        return { ...defaultStyle, ...style }
    }, [style]);

    const currentMargin = useMemo(() => {
        return { ...defaultMargin, ...margin }
    }, [margin]);

    const list = useMemo(() => {
        return labels?.map((label) => {
            const { fill, stroke } = getRandomHarmonicPalette();
            return {
                ...label,
                fill: label?.fill || fill,
                stroke: label?.stroke || stroke,
                fillOpacity: label?.fillOpacity || 0.6,
            }
        })
    }, [labels]);

    const axis = useMemo(() => {
        const angle: PolarAngleAxisProps = !polarAngleAxis ? {
            dataKey: value,
        } : polarAngleAxis;

        const radius: PolarRadiusAxisProps = !polarRadiusAxis ? {} : polarRadiusAxis;

        return {
            angle,
            radius
        }
    }, [polarAngleAxis, polarRadiusAxis, value])

    return (
        <RadarChartComponent
            style={currentStyle}
            data={radars}
            margin={currentMargin}
            responsive={responsive}
            outerRadius={outerRadius}
        >
            <PolarGrid />
            <PolarAngleAxis dataKey={axis.angle.dataKey} />
            <PolarRadiusAxis angle={axis.radius.angle} domain={axis.radius.domain} />

            {list.map((label, index) => (
                <Radar
                    key={`${label.key}-${index}`}
                    name={label.name}
                    dataKey={label.dataKey}
                    stroke={label.stroke}
                    fill={label.fill}
                    fillOpacity={label.fillOpacity}
                    data-testid={`ds-radar-chart-area-${index}`}
                />
            ))}

            {withTooltip && (
                <Tooltip content={tooltipContent} />
            )}


            { withLegend && (
                    <Legend/>
            )}

        </RadarChartComponent>
    );
}