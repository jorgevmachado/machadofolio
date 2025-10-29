import React from 'react';

import { XAxis, YAxis } from 'recharts';

export type TChart = 'bar' | 'pie' | 'area';

export type TWrapper = 'default' | 'card';

export type XAxisProps = React.ComponentProps< typeof XAxis>;
export type YAxisProps = React.ComponentProps< typeof YAxis>;

export type ChartTooltipParams = {
    active?: boolean;
    payload?: Array<PayloadItemProps>;
    countText?: string;
    valueText?: string;
    percentageText?: string;
};

export type PayloadItemProps = {
    hide: boolean;
    name: string;
    fill?: any;
    type?: any;
    unit?: any;
    value: number;
    color?: string;
    stroke?: any;
    dataKey: string;
    nameKey?: any;
    payload: Record<string, string | number>;
    strokeWidth?: any;
}

export type ColorProps = {
    fill: string;
    type: string;
    name: string;
    color: string;
    stroke: string;
};
