import type React from 'react';

import { type LabelListProps, type Scatter } from 'recharts';

import {
    type AxisProps,
    type LegendProps,
    type MarginProps,
    type TLayout,
    type TooltipProps,
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