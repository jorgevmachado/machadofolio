import { type AxisProps, type DataChartItem, type LegendProps, type TLayout, type TooltipProps } from '../../types';

import { type LabelListProps, type LabelProps } from 'recharts';

export type BarChartDataItem = DataChartItem & {
    fill?: string;
    type?: string;
    name: string;
    value?: string | number;
    color?: string;
    stroke?: string;
    colorName?: string;
};

export type ActiveBar = {
    type: 'rectangle',
    fill?: string;
    stroke?: string;
}

export type LabelListContent = LabelProps & {
    fillText?: string
}

export type LabelList = LabelListProps & {
    fill?: string;
    dataKey: string;
    position?: 'top' | 'bottom' | 'center';
    withCustomContent?: boolean;
    withCurrencyFormatter?: boolean;
}

export type BarChartLabelsItem = {
    key: string;
    fill?: string;
    radius?: [number, number, number, number];
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