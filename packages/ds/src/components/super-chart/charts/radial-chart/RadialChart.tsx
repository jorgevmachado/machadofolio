import React, { useMemo } from 'react';

import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts';

import type { LegendProps, RadialChartProps } from './types';
import { getRandomHarmonicPalette } from '../../colors';

const defaultStyle = {
    width: '100%',
    maxWidth: '700px',
    maxHeight: '80vh',
    aspectRatio: 1.618
}

const defaultWrapperStyle = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
};

export default function RadialChart({
    cx = '30%',
    data,
    style,
    legend,
    labels,
    barSize = 14,
    responsive = true,
    withTooltip = true,
    tooltipContent
}: RadialChartProps) {

    const dataList = useMemo(() => {
        return data.map((item) => {
            const { fill } = getRandomHarmonicPalette();
            return {
                ...item,
                fill: item?.fill || fill,
            }
        })
    }, [data]);

    const labelList = useMemo(() => {
        return labels?.map((item) => {
            const { fill } = getRandomHarmonicPalette();
            return {
                ...item,
                fill: item?.fill || fill,
                position: item?.position || 'insideStart',
                background: item?.background === undefined ? true : item.background,
            }
        })
    }, [labels]);

    const currentStyle = { ...defaultStyle, ...style };

    const legendProps = useMemo(() => {
        const { layout, iconSize, wrapperStyle, verticalAlign } = legend || {} as LegendProps;
        return {
            layout: !layout ? 'vertical' : layout,
            iconSize: !iconSize ? 8 : iconSize,
            wrapperStyle: { ...defaultWrapperStyle, ...wrapperStyle },
            verticalAlign:  !verticalAlign ? 'middle' : verticalAlign,
        };
    }, [legend]);

    return (
        <RadialBarChart
            cx={cx}
            data={dataList}
            style={currentStyle}
            responsive={responsive}
            barSize={barSize}
        >
            { labelList?.map((item, index) => (
                <RadialBar
                    key={`${item.key}-${index}`}
                    label={{ position: item.position, fill: item.fill, stroke: item?.stroke }}
                    dataKey={item.dataKey}
                    background={item.background}
                    data-testid={`ds-radial-chart-bar-${index}`}
                />
            ))}

            <Legend
                layout={legendProps.layout}
                iconSize={legendProps.iconSize}
                wrapperStyle={legendProps.wrapperStyle}
                verticalAlign={legendProps.verticalAlign}
            />

            {withTooltip && (
                <Tooltip content={tooltipContent} />
            )}
        </RadialBarChart>
    );
}