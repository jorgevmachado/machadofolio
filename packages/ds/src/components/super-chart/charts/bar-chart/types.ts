import React from 'react';

import { ChartTooltipParams, DataChartItem, TLayout, XAxisProps, YAxisProps } from '../../types';

export type BarChartDataItem = DataChartItem & {
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
    position?: 'top' | 'bottom' | 'center';
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
    layout?: TLayout;
    labels?: Array<BarChartLabelsItem>;
    withLegend?: boolean;
    withTooltip?: boolean;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
    withCurrencyTickFormatter?: boolean;
}