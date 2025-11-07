import React from 'react';

import { Area, Bar, Line, Scatter,  } from 'recharts';

import {
    AxisProps,
    CartesianGridProps,
    LegendProps,
    MarginProps,
    TooltipProps,
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

export type ComposedChartProps = {
    bars?: Array<BarProps>;
    axis?: AxisProps;
    data: Array<composedChartDataItem>;
    areas?: Array<AreaProps>;
    lines?: Array<LineProps>;
    style?: React.CSSProperties;
    layout?: 'vertical' | 'horizontal';
    margin?: MarginProps;
    legend?: LegendProps;
    tooltip?: TooltipProps;
    scatters?: Array<ScatterProps>;
    responsive?: boolean;
    cartesianGrid?: CartesianGridProps;

}