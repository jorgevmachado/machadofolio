import { AxisProps, DataChartItem, LegendProps, TLayout, TooltipProps } from '../../types';

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
    axis?: AxisProps;
    data: Array<BarChartDataItem>;
    layout?: TLayout;
    legend?: LegendProps;
    labels?: Array<BarChartLabelsItem>;
    tooltip?: TooltipProps;
}