import React from 'react';

import { Pie } from 'recharts';

import { DataChartItem, LegendProps, MarginProps, TooltipProps } from '../../types';

export type PieChartDataItem = DataChartItem & {
    fill?: string;
    name: string;
    value: number;
};

export type PieProps = React.ComponentProps<typeof Pie> & {
    key: string;
    data: Array<PieChartDataItem>;
    color?: string;
    value?: number;
    colorName?: string;
    [key: string]: unknown;
};

export type PieCoordinate = {
    x: number;
    y: number;
};

export type PieSectorData = {
    value?: number;
    name?: string | number;
    dataKey?: string;
    payload?: any;
    percent?: number;
    midAngle?: number;
    middleRadius?: number;
    paddingAngle?: number;
    tooltipPosition?: PieCoordinate;
};

export type PieChartProps = {
    data: Array<PieProps>;
    style?: React.CSSProperties;
    margin?: MarginProps;
    legend?: LegendProps;
    tooltip?: TooltipProps;
    responsive?: boolean;
    withNeedle?: boolean;
    withDefaultCustomLabel?: boolean;
    withDefaultActiveShape?: boolean;
};