import React from 'react';

import { LabelListProps, Scatter } from 'recharts';

import {
    AxisProps,
    LegendProps,
    MarginProps,
    TLayout,
    TooltipProps,
} from '../../types';

export type ScatterChartDataItem = Omit<React.ComponentProps<typeof Scatter>, 'key'> & {
    key: string;
    withCell?: boolean;
    showTicks?: boolean;
    labelList?: LabelListProps
};

export type ScatterChartProps = {
    type?: 'bubble' | 'scatter';
    axis?: AxisProps;
    data: Array<ScatterChartDataItem>;
    range?: [number, number];
    style?: React.CSSProperties;
    domain?: Array<number>;
    legend?: LegendProps;
    margin?: Partial<MarginProps>;
    layout?: TLayout;
    tooltip?: TooltipProps;
    responsive?: boolean;
    bubbleStyle?: React.CSSProperties;
}