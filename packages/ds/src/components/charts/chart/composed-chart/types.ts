import type React from 'react';

import {
    type AxisProps,
    type CartesianGridProps,
    type LegendProps,
    type MarginProps,
    type TooltipProps,
} from '../../types';

import { type Area, type Bar, type Line, type Scatter,  } from 'recharts';

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