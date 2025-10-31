import React from 'react';

import { Line, MouseHandlerDataParam } from 'recharts';

import Button from '../../../button';

import { ChartTooltipParams, DataChartItem, MarginProps, TLayout, XAxisProps, YAxisProps } from '../../types';

type ButtonProps = React.ComponentProps<typeof Button>;

export type LineProps = React.ComponentProps<typeof Line>;

export type ReferenceAreaProps = {
    yAxisId?: string | number;
    strokeOpacity?: string | number;
};

export type ReferenceLineProps = {
    x?: number | string;
    y?: number | string;
    show: boolean;
    fill?: string;
    label?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
};

export type LineChartDataItem = DataChartItem & {
    fill?: string;
    type?: string;
    name?: string | number;
    color?: string;
    stroke?: string;
};

export type TLineChartLabel =
    'basis'
    | 'basisClosed'
    | 'basisOpen'
    | 'bumpX'
    | 'bumpY'
    | 'bump'
    | 'linear'
    | 'linearClosed'
    | 'natural'
    | 'monotoneX'
    | 'monotoneY'
    | 'monotone'
    | 'step'
    | 'stepBefore'
    | 'stepAfter';

export type CustomizeDotSvgParams = {
    x: number;
    y: number;
    fill: string;
    width: number;
    height: number;
}

export type CustomDot = {
    svg?: (props: CustomizeDotSvgParams) => React.ReactNode;
    width?: number;
    height?: number;
    fillMin?: string;
    fillMax?: string;
    maxValue?: number;
}

export type CustomLabel = {
    dy?: number;
    fill?: string;
    fontSize?: number;
    textAnchor?: string;
}

export type CustomizeLabelParams = {
    x?: number | string;
    y?: number | string;
    value?: number | string;
    stroke?: string;
    customLabel?: CustomLabel;
}

export type LineChartLabelsItem = {
    key: string;
    dot?: LineProps['dot'];
    fill?: string;
    data?: Array<LineChartDataItem>;
    type?: TLineChartLabel;
    name?: string;
    label?: LineProps['label'];
    offset?: number
    stroke?: string;
    dataKey: string;
    yAxisId?: string | number;
    activeDot?: LineProps['activeDot'];
    customDot?: CustomDot;
    customLabel?: CustomLabel;
    tooltipType?: 'none',
    strokeWidth?: string | number;
    strokeDasharray?: string | number;
    animationDuration?: number;
}

type CustomAxisTick = {
    x?: number;
    y?: number;
    dy?: number | string;
    fill?: string;
    transform?: string;
    textAnchor?: string;
}

export type CustomAxisTickParams = {
    x: number;
    y: number;
    payload: { value: string; };
    customAxisTick?: CustomAxisTick;
}


export type TCustomDomain =
    'top'
    | 'top2'
    | 'left'
    | 'right'
    | 'bottom'
    | 'bottom2'
    | 'animation'
    | 'refAreaLeft'
    | 'refAreaRight';

export type CustomXAxisProps = XAxisProps & {
    customDomain?: Array<TCustomDomain>;
    customAxisTick?: CustomAxisTick
}

export type CustomYAxisProps = YAxisProps & {
    customDomain?: Array<TCustomDomain>;
    customAxisTick?: CustomAxisTick
}

export type AxisDomainItem = string | number | ((d: number) => string | number) | 'auto' | 'dataMin' | 'dataMax';

export type NumberDomain = readonly [min: number, max: number];

export type AxisDomain =
    ReadonlyArray<string>
    | ReadonlyArray<number>
    | Readonly<[AxisDomainItem, AxisDomainItem]>
    | (([dataMin, dataMax]: NumberDomain, allowDataOverflow: boolean) => NumberDomain);

export type LineChartProps = {
    data?: Array<LineChartDataItem>;
    style?: React.CSSProperties;
    xAxis?: Array<CustomXAxisProps>;
    yAxis?: Array<CustomYAxisProps>;
    layout?: TLayout;
    labels?: Array<LineChartLabelsItem>;
    margin?: Partial<MarginProps>;
    withAxis?: boolean | { x: boolean; y: boolean; };
    withZoom?: boolean;
    onMouseUp?: (event: MouseHandlerDataParam) => void;
    withLegend?: boolean;
    responsive?: boolean;
    withTooltip?: boolean;
    onMouseDown?: (event: MouseHandlerDataParam) => void;
    onMouseMove?: (event: MouseHandlerDataParam) => void;
    referenceArea?: ReferenceAreaProps;
    buttonZoomOut?: ButtonProps;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
    referenceLines?: Array<ReferenceLineProps>;
    withMultiSeries?: boolean;
}