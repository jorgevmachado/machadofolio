import React, { useMemo } from 'react';

import { DefaultLegendContent, DefaultTooltipContent } from 'recharts';

import type { CompareFilterParams, FilteredChartProps } from './types';

export default function FilteredChart({ filteredLegend, filteredTooltip }: FilteredChartProps) {

    const hasFilter = filteredLegend ?? filteredTooltip;

    const compare = ({ param, value, condition }: CompareFilterParams) => {
        if (!param) {
            return true;
        }
        if (!value) {
            return true;
        }
        if (!condition) {
            return true;
        }
        switch (condition) {
            case '===':
                return param === value;
            case '!==':
                return param !== value;
            case '>':
                return param > value;
            case '<':
                return param < value;
            case '>=':
                return param >= value;
            case '<=':
                return param <= value;
            default:
                return true;
        }
    };

    const currentFilteredLegend = useMemo(() => {
        if (!filteredLegend) {
            return null;
        }
        const { payload, filterContent, ...props } = filteredLegend;

        if (!filterContent) {
            return {
                ...props,
                payload,
            }
        }

        const { label, value, condition } = filterContent;

        const newPayload = payload?.filter((item) => compare({
            param: item?.[label] as string | number,
            value,
            condition
        }));

        return {
            ...props,
            payload: newPayload,
        };
    }, [filteredLegend]);

    const currentFilteredTooltip = useMemo(() => {
        if (!filteredTooltip) {
            return null;
        }

        const { payload, filterContent, ...props } = filteredTooltip;
        if (!filterContent) {
            return {
                ...props,
                payload,
            }
        }


        const { label, value, condition } = filterContent;

        const newPayload = payload?.filter((item) => compare({
            param: item?.[label] as string | number,
            value,
            condition
        }));

        return {
            ...props,
            payload: newPayload,
        };


    }, [filteredTooltip])

    return hasFilter ? (
        <>
            {currentFilteredLegend && (
                <DefaultLegendContent {...currentFilteredLegend}  data-testid="ds-filtered-chart-legend"/>
            )}

            {currentFilteredTooltip && (
                <DefaultTooltipContent {...currentFilteredTooltip} data-testid="ds-filtered-chart-tooltip" />
            )}
        </>
    ) : null
}