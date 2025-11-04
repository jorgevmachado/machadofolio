import React from 'react';

import { Area, Bar, Line, Scatter,  } from 'recharts';

import type {
    CartesianGridProps,
    FilterContent,
    LegendProps,
    MarginProps,
    TooltipProps,
    XAxisProps,
    YAxisProps
} from '../../types';

type AreaProps = React.ComponentProps<typeof Area> & {
    key: string;
};

type BarProps = React.ComponentProps<typeof Bar> & {
    key: string;
};

type LineProps = React.ComponentProps<typeof Line> & {
    key: string;
};

type ScatterProps = React.ComponentProps<typeof Scatter> & {
    key: string;
};

type composedChartDataItem = Record<string, string | number | Array<string | number>>;


export type ComposedChartLegendProps = LegendProps & {
    show?: boolean;
    filterContent?: FilterContent;
}

export type ComposedChartTooltipProps = TooltipProps & {
    filterContent?: FilterContent;
}

export type ComposedChartProps = {
    bars?: Array<BarProps>;
    data: Array<composedChartDataItem>;
    areas?: Array<AreaProps>;
    lines?: Array<LineProps>;
    xAxis?: Array<XAxisProps & { key: string; }>;
    yAxis?: Array<YAxisProps & { key: string; }>;
    style?: React.CSSProperties;
    layout?: 'vertical' | 'horizontal';
    margin?: MarginProps;
    legend?: ComposedChartLegendProps;
    tooltip?: ComposedChartTooltipProps;
    scatters?: Array<ScatterProps>;
    responsive?: boolean;
    cartesianGrid?: CartesianGridProps;

}