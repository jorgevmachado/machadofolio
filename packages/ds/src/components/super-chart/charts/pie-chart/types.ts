import React from 'react';

import { Pie } from 'recharts';

import type { DataChartItem, MarginProps, ChartTooltipParams  } from '../../types';

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
    pies: Array<PieProps>;
    style?: React.CSSProperties;
    margin?: MarginProps;
    responsive?: boolean;
    withNeedle?: boolean;
    withLegends?: boolean;
    withTooltip?: boolean;
    defaultIndex?: string;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
    withoutContentTooltip?: boolean;
    withDefaultCustomLabel?: boolean;
    withDefaultActiveShape?: boolean;
};