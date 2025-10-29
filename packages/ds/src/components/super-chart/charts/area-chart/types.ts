import React from 'react';
import type { ChartTooltipProps } from '../../../chart';
import type { XAxisProps, YAxisProps } from '../../types';

export type AreaChartDataItem = Record<string, string | number> & {
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
    areas: Array<AreaChartDataItem>;
    style?: React.CSSProperties;
    labels?: Array<AreaChartLabelsItem>;
    margin?: { top: number; right: number; bottom: number; left: number };
    syncId?: string;
    withXAxis?: boolean;
    withYAxis?: boolean;
    responsive?: boolean;
    stackOffset?: 'expand';
    withTooltip?:boolean;
    linearGradient?: AreaChartLinearGradient;
    tooltipContent?: (params: ChartTooltipProps) => React.ReactNode;
    withPercentFormatter?: boolean;
};