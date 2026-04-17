import type React from 'react';

import { type AxisProps,type DataChartItem, type LegendProps, type MarginProps, type TooltipProps } from '../../types';

export type AreaChartDataItem = DataChartItem & {
    name: string;
};

export type AreaChartLabelsItem = {
    key: string;
    fill?: string;
    type: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey: string;
    stroke?: string;
    stackId?: string;
    fillOpacity?: number;
    curveCardinalTension?: number;
}

export type AreaChartLinerGradientStopItem = {
    key: string;
    offset?: string;
    stopColor: string;
    stopOpacity?: number;
}

export type AreaChartLinearGradient = {
    id: string;
    x1?: string;
    x2?: string;
    y1?: string;
    y2?: string;
    value: string;
    stops: Array<AreaChartLinerGradientStopItem>;
}

export type AreaChartProps = {
    axis?: AxisProps;
    data: Array<AreaChartDataItem>;
    style?: React.CSSProperties;
    labels?: Array<AreaChartLabelsItem>;
    legend?: LegendProps;
    margin?: MarginProps;
    syncId?: string;
    tooltip?: TooltipProps;
    responsive?: boolean;
    stackOffset?: 'expand';
    linearGradient?: AreaChartLinearGradient;
};