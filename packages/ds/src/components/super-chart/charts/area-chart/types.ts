import React from 'react';

import type { MarginProps, XAxisProps, YAxisProps, DataChartItem, ChartTooltipParams, TooltipProps } from '../../types';

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
    xAxis?: XAxisProps;
    yAxis?: YAxisProps;
    data: Array<AreaChartDataItem>;
    style?: React.CSSProperties;
    labels?: Array<AreaChartLabelsItem>;
    margin?: MarginProps;
    syncId?: string;
    tooltip?: TooltipProps;
    withXAxis?: boolean;
    withYAxis?: boolean;
    responsive?: boolean;
    stackOffset?: 'expand';
    linearGradient?: AreaChartLinearGradient;
};