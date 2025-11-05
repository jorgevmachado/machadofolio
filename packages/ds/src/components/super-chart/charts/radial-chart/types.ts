import React from 'react';

import type { DataChartItem, TooltipProps } from '../../types';

export type LegendProps = {
    layout?: 'horizontal' | 'vertical';
    iconSize?: number;
    wrapperStyle?: React.CSSProperties;
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

export type RadialChartDataItem = DataChartItem;

export type RadialChartLabelsItem = {
    key: string;
    fill?: string;
    stroke?: string;
    dataKey: string;
    position?: 'insideStart' | 'insideEnd' | 'center' | 'outside';
    background?: boolean;
}

export type RadialChartProps = {
    cx?: string;
    data: Array<RadialChartDataItem>;
    style?: React.CSSProperties;
    labels?: Array<RadialChartLabelsItem>;
    legend?: LegendProps;
    tooltip?: TooltipProps;
    barSize?: number;
    responsive?: boolean;
};