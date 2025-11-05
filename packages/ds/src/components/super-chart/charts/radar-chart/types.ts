import React from 'react';

import type { DataChartItem, MarginProps, TooltipProps } from '../../types';

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
    data: Array<RadarChartDataItem>;
    value: PolarAngleAxisProps['dataKey'];
    style?: React.CSSProperties;
    labels: Array<RadarChartLabelsItem>;
    margin?: MarginProps;
    tooltip?: TooltipProps;
    responsive?: boolean;
    withLegend?: boolean;
    outerRadius?: string;
    polarAngleAxis?: PolarAngleAxisProps;
    polarRadiusAxis?: PolarRadiusAxisProps;
}