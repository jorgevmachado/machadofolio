import React from 'react';

import { Pie } from 'recharts';

import { ChartTooltipProps } from '../../../chart';

export type PieChartDataItem = Record<string, string | number> & {
    fill?: string;
    name: string;
    value: number;
};

export type PieProps = React.ComponentProps<typeof Pie> & {
    key: string;
    data: Array<PieChartDataItem>;
    color?: string;
    value?: number;
};

export type PieChartProps = {
    pies: Array<PieProps>;
    style?: React.CSSProperties;
    margin?: { top: number; right: number; bottom: number; left: number };
    responsive?: boolean;
    withNeedle?: boolean;
    withLegends?: boolean;
    defaultIndex?: string;
    tooltipContent?: (params: ChartTooltipProps) => React.ReactNode;
    withoutTooltip?: boolean;
    withDefaultCustomLabel?: boolean;
    withDefaultActiveShape?: boolean;
}

export type PieCoordinate = {
    x: number;
    y: number;
}

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