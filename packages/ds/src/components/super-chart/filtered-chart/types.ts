import { DefaultLegendContentProps, TooltipContentProps } from 'recharts';

export type FilterContent = {
    label: 'dataKey';
    value: string | number;
    condition: '===' | '!==' | '>' |  '<' | '>=' | '<=';
}

export type CompareFilterParams = Omit<FilterContent, 'label'> & {
    param: string | number;
}

export type FilteredLegendProps = Omit<DefaultLegendContentProps, 'ref'> & {
    filterContent?: FilterContent;
}

type TValue = number | string | Array<number | string>;
type TName = number | string;

export type FilteredTooltipProps = TooltipContentProps<TValue, TName> & {
    filterContent?: FilterContent;
}

export type FilteredChartProps = {
    filteredLegend?: FilteredLegendProps;
    filteredTooltip?: FilteredTooltipProps;
}