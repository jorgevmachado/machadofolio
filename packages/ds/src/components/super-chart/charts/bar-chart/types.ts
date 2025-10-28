import React from 'react';

import { XAxis, YAxis } from 'recharts';
import type { ChartTooltipParams } from '../../types';

export type XAxisProps = React.ComponentProps< typeof XAxis>;
export type YAxisProps = React.ComponentProps< typeof YAxis>;

export type BarChartDataItem = Record<string, string | number> & {
    fill?: string;
    type?: string;
    name: string;
    color?: string;
    stroke?: string;
};

export type ActiveBar = {
    type: 'rectangle',
    fill?: string;
    stroke?: string;
}

export type LabelList = {
    fill?: string;
    dataKey: string;
    withContent?: boolean;
}

export type BarChartLabelsItem = {
    key: string;
    fill?: string;
    stroke?: string;
    stackId?: string;
    labelList?: LabelList;
    activeBar?: ActiveBar;
    background?: { fill: string };
    minPointSize?: number;
}

export type BarChartProps = {
    top?: number;
    data: Array<BarChartDataItem>;
    xAxis?: Array<XAxisProps>;
    yAxis?: Array<YAxisProps>;
    labels?: Array<BarChartLabelsItem>;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
}