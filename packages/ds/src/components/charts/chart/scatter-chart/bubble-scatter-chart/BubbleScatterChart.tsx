import React from 'react';

import { Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';

import type { MarginProps, TooltipProps, XAxisProps, YAxisProps, ZAxisProps } from '../../../types';

import type { ScatterChartDataItem } from '../types';

type AxisProps = {
    x?: XAxisProps;
    y?: YAxisProps;
    z?: ZAxisProps;
}

type BubbleScatterChartProps = {
    data: Array<ScatterChartDataItem>;
    axis: AxisProps;
    range?: [number, number];
    style: React.CSSProperties;
    domain?: Array<number>;
    margin?: MarginProps;
    tooltip?: TooltipProps;
    responsive?: boolean;
    bubbleStyle?: React.CSSProperties;
};


export default function BubbleScatterChart({
                                               data,
                                               axis,
                                               range,
                                               style,
                                               margin,
                                               domain,
                                               tooltip,
                                               responsive,
                                               bubbleStyle
                                           }: Readonly<BubbleScatterChartProps>) {
    return (
        <div style={bubbleStyle} data-testid="ds-bubble-scatter-chart">
            { data.map((item, index) => (
                <ScatterChart
                    key={`ds-bubble-scatter-chart-${item.key}-${index}`}
                    style={style}
                    margin={margin}
                    responsive={responsive}
                    data-testid={`ds-bubble-scatter-chart-${index}`}
                >

                    <XAxis
                        {...axis.x}
                        tick={Boolean(item?.showTicks) || { fontSize: 0 }}
                        data-testid={`ds-bubble-scatter-chart-x-axis-${index}`}
                    />
                    <YAxis
                        {...axis.y}
                        label={{  value: item?.name }}
                        data-testid={`ds-bubble-scatter-chart-y-axis-${index}`}
                    />
                    <ZAxis
                        {...axis.z}
                        domain={domain}
                        range={range ?? [16, 225]}
                        data-testid={`ds-bubble-scatter-chart-z-axis-${index}`}
                    />

                    <Scatter
                        data={item.data}
                        fill={item?.fill || '#8884d8'}
                        data-testid={`ds-bubble-scatter-chart-scatter-${index}`}
                    />
                    {tooltip && (
                        <Tooltip
                            {...tooltip}
                            data-testid={`ds-bubble-scatter-chart-tooltip-${index}`}
                        />
                    )}
                </ScatterChart>
            ))}

        </div>
    )
}