import React from 'react';

import { Pie } from 'recharts';

import type { DataChartItem, MarginProps, TooltipProps } from '../../types';

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
    tooltip?: TooltipProps;
    responsive?: boolean;
    withNeedle?: boolean;
    withLegends?: boolean;
    withDefaultCustomLabel?: boolean;
    withDefaultActiveShape?: boolean;
};