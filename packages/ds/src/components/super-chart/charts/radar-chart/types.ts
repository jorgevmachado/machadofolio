import React from 'react';

import type { ChartTooltipParams, DataChartItem, MarginProps } from '../../types';

export type RadarChartDataItem = DataChartItem;

export type PolarRadiusAxisProps = {
    angle?: number;
    domain?: Array<number>;
};

export type PolarAngleAxisProps = {
    dataKey: string;
};

export type RadarChartLabelsItem = {
    key: string;
    fill?: string;
    name: string;
    stroke?: string;
    dataKey: string;
    fillOpacity?: number;
}

export type RadarChartProps = {
    value: PolarAngleAxisProps['dataKey'];
    style?: React.CSSProperties;
    radars: Array<RadarChartDataItem>;
    labels: Array<RadarChartLabelsItem>;
    margin?: MarginProps;
    responsive?: boolean;
    withLegend?: boolean;
    outerRadius?: string;
    withTooltip?:boolean;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
    polarAngleAxis?: PolarAngleAxisProps;
    polarRadiusAxis?: PolarRadiusAxisProps;
}