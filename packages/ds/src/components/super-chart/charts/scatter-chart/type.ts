import React from 'react';

import { LabelListProps, Scatter } from 'recharts';

import type { LegendProps, MarginProps, TLayout, TooltipProps, XAxisProps, YAxisProps, ZAxisProps } from '../../types';

export type ScatterChartDataItem = Omit<React.ComponentProps<typeof Scatter>, 'key'> & {
    key: string;
    withCell?: boolean;
    showTicks?: boolean;
    labelList?: LabelListProps
};

export type ScatterChartProps = {
    type?: 'bubble' | 'scatter';
    data: Array<ScatterChartDataItem>;
    range?: [number, number];
    xAxis?: Array<XAxisProps>;
    yAxis?: Array<YAxisProps>;
    zAxis?: Array<ZAxisProps>;
    style?: React.CSSProperties;
    domain?: Array<number>;
    legend?: LegendProps;
    margin?: Partial<MarginProps>;
    layout?: TLayout;
    tooltip?: TooltipProps;
    responsive?: boolean;
    bubbleStyle?: React.CSSProperties;
}