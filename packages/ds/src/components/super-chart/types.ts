import React from 'react';

import { Text } from '../../elements';

import { XAxis, YAxis, ZAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export type TChart = 'bar' | 'pie' | 'area' | 'radar' |  'radial' | 'line' | 'scatter' | 'composed';

export type TWrapper = 'default' | 'card';

export type LegendProps = React.ComponentProps<typeof Legend> & {
    show?: boolean;
    filterContent?: FilterContent;
};

export type TextTooltipProps = Omit<React.ComponentProps<typeof Text>, 'children'> & {
    type: string;
    text?: string;
    dataName: string | number;
    appendText?: string;
    withCurrencyFormatter?: boolean;
};

export type GenericTextProps = TextProps & {
    withName?: boolean;
    withValue?: boolean;
    withSubLevel?: boolean;
    withTotalPercent?: boolean;
}

export type TooltipProps = React.ComponentProps<typeof Tooltip> & {
    show?: boolean;
    style?: React.CSSProperties;
    active?: boolean;
    payload?: Array<PayloadItemProps>;
    nameProps?: TextProps;
    labelProps?: TextProps;
    hourProps?: TextProps;
    countProps?: TextProps;
    valueProps?: TextProps;
    withContent?: boolean;
    withSubLevel?: boolean;
    filterContent?: FilterTooltipContent;
    percentageProps?: TextProps;
    genericTextProps?: GenericTextProps;
    withTotalPercent?: boolean;
    withGenericProps?: boolean;
    withCustomTooltip?: boolean;
    withDefaultTooltip?: boolean;
    withPercentFormatter?: boolean;
};

export type TextProps = Omit<Partial<TextTooltipProps>, 'type' | 'dataName'> & {
  show?: boolean;
};

export type XAxisProps = React.ComponentProps< typeof XAxis>;

export type YAxisProps = React.ComponentProps< typeof YAxis>;

export type ZAxisProps = React.ComponentProps< typeof ZAxis> & {
    key?: string;
};

export type CartesianGridProps = React.ComponentProps<typeof CartesianGrid>;

export type MarginProps = { top: number; right: number; bottom: number; left: number };

export type ChartTooltipParams = {
    style?: React.CSSProperties;
    active?: boolean;
    label?: string | number;
    payload?: Array<PayloadItemProps>;
    nameProps?: TextProps;
    hourProps?: TextProps;
    countProps?: TextProps;
    valueProps?: TextProps;
    percentageProps?: TextProps;
    genericTextProps?: TextProps & { withCurrencyFormatter?: boolean };
    withGenericProps?: boolean;
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

export type DataChartItem = Record<string, string | number>;

export type TLayout = 'vertical' | 'horizontal';

export type FilterContent = {
    label: 'dataKey';
    value: string | number;
    condition: '===' | '!==' | '>' |  '<' | '>=' | '<=';
}


type TByFilterTooltipContent = 'label' | 'value' | 'condition';

type FilterTooltipContentItem = {
    by?: TByFilterTooltipContent;
    label: string;
    value?: string | number;
    condition: '===' | '!==' | '>' |  '<' | '>=' | '<=' | 'empty';
}
type FilterTooltipContent = Array<FilterTooltipContentItem>

export type CompareFilterTooltipParams = Omit<FilterTooltipContentItem, 'by'> & {
    by: TByFilterTooltipContent;
    param?: string | number;

}
// Novo tipo para aceitar array ou único filtro
export type FilterContentInput = FilterContent | FilterContent[];

export type CompareFilterParams = Omit<FilterContent, 'label'> & {
    param: string | number;
}