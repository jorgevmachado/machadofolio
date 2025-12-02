import React, { useMemo } from 'react';

import { compareFilter } from '../filters';

import { type ChartContentLegendProps } from './types';

import { DefaultLegendContent } from 'recharts';

export default function ChartContentLegend({
                                               params,
                                               legend
                                           }: Readonly<ChartContentLegendProps>) {

    const currentPayload = useMemo(() => {
        const payload = params?.payload || [];
        if(legend?.filterContent && legend?.filterContent.length > 0) {
            const { filterContent } = legend;
            return payload.filter((item) => filterContent.every(({ by = 'value', label, ...props}) => compareFilter({
                ...props,
                by,
                label,
                param: (item as Record<string, string | number>)[label],
            })))
        }
        return payload;
    }, [params?.payload, legend]);


    return (
        <DefaultLegendContent {...params} payload={currentPayload}  data-testid="ds-chart-content-legend"/>
    )
}