import React from 'react';

import { LabelListProps, Scatter } from 'recharts';

import {
    ChartTooltipParams,
    MarginProps,
    TLayout, TooltipProps,
    XAxisProps,
    YAxisProps,
    ZAxisProps
} from '../../types';

type ScatterProps = Omit<React.ComponentProps<typeof Scatter>, 'key'> & {
    key: string;
    withCell?: boolean;
    showTicks?: boolean;
    labelList?: LabelListProps
};

export type ScatterChartDataItem = ScatterProps;

export type ScatterChartProps = {
    type?: 'bubble' | 'scatter';
    data: Array<ScatterChartDataItem>;
    range?: [number, number];
    xAxis?: Array<XAxisProps>;
    yAxis?: Array<YAxisProps>;
    zAxis?: Array<ZAxisProps>;
    style?: React.CSSProperties;
    domain?: Array<number>;
    margin?: Partial<MarginProps>;
    layout?: TLayout;
    tooltip?: TooltipProps;
    responsive?: boolean;
    withLegend?: boolean;
    withTooltip?: boolean;
    bubbleStyle?: React.CSSProperties;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
}