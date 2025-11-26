import React, { useMemo } from 'react';

import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts';

import type { LegendProps } from '../../types';

import { mapListColors } from '../../colors';

import { RadialChartLabelsItem, RadialChartProps } from './types';


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
    tooltip,
    responsive = true,
}: Readonly<RadialChartProps>) {

    const dataList = useMemo(() => {
        return mapListColors<RadialChartProps['data'][number]>(data).map((item) => {
            delete item.stroke;
            return item;
        });
    }, [data]);

    const labelList = useMemo(() => {
        return mapListColors<RadialChartLabelsItem>(labels ?? []).map((item) => {
            delete item.stroke;
            return {
                ...item,
                position: item?.position || 'insideStart',
                background: item?.background ?? true,
            }
        });
    }, [labels]);

    const currentStyle = { ...defaultStyle, ...style };

    const currentLegend = useMemo(() => {
        if(!legend) {
            return legend;
        }
        const defaultLegend : LegendProps = { ...legend };
        defaultLegend.layout = legend?.layout ?? 'vertical';
        defaultLegend.iconSize = legend?.iconSize ?? 8;
        defaultLegend.wrapperStyle = { ...defaultWrapperStyle, ...legend?.wrapperStyle };
        defaultLegend.verticalAlign = legend?.verticalAlign ?? 'middle';
        return defaultLegend;
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

            {legend && (
                <Legend {...currentLegend}/>
            )}

            {tooltip && (
                <Tooltip {...tooltip} />
            )}
        </RadialBarChart>
    );
}