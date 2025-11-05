import { DefaultLegendContentProps, TooltipContentProps } from 'recharts';

import { FilterContent } from '../types';

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