import type { LegendProps, TooltipProps } from './types';
import { ChartContentLegend, ChartContentTooltip, type LegendContentProps, type TooltipContentProps } from './content';

export function buildTooltip(tooltip?: TooltipProps) {
    const defaultTooltip: TooltipProps = { ...tooltip };

    if(tooltip?.show === false) {
        return undefined;
    }

    if(defaultTooltip.content) {
        return defaultTooltip;
    }

    defaultTooltip.content = tooltip?.withContent === false
        ? undefined
        : (props: TooltipContentProps) => ChartContentTooltip({ params: props, tooltip: defaultTooltip });

    return defaultTooltip;
}

export function buildLegend(legend?: LegendProps) {
    const defaultLegend: LegendProps = { ...legend };

    if(defaultLegend?.show === false) {
        return undefined;
    }

    if(defaultLegend?.content) {
        return defaultLegend;
    }

    if(defaultLegend?.withContent === false) {
        return defaultLegend;
    }

    defaultLegend.content = (props) => ChartContentLegend({
        params: props as LegendContentProps,
        legend: defaultLegend
    });

    return defaultLegend;
}