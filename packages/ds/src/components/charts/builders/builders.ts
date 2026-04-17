import { convertToPercent, currencyFormatter } from '@repo/services';

import { ChartContentLegend, ChartContentTooltip, type LegendContentProps, type TooltipContentProps } from '../content';
import { type AxisProps, type LegendProps, type TChart, type TLayout, type TooltipProps, type XAxisProps, type YAxisProps, type ZAxisProps } from '../types';


export function buildTooltip(tooltip?: TooltipProps) {
    const defaultTooltip: TooltipProps = { ...tooltip };

    if (tooltip?.show === false) {
        return undefined;
    }

    if (defaultTooltip.content) {
        return defaultTooltip;
    }

    if (defaultTooltip.withDefaultTooltip) {
        return defaultTooltip;
    }

    if (tooltip?.withContent !== false) {
        defaultTooltip.content = (props) =>
            ChartContentTooltip({ params: props as TooltipContentProps, tooltip: defaultTooltip });
        return defaultTooltip;
    }

    return defaultTooltip;
}

export function buildLegend(legend?: LegendProps) {
    const defaultLegend: LegendProps = { ...legend };

    if (defaultLegend?.show === false) {
        return undefined;
    }

    if (defaultLegend?.content) {
        return defaultLegend;
    }

    if (defaultLegend?.withDefaultLegend) {
        return defaultLegend;
    }

    if (defaultLegend?.withContent === false) {
        return defaultLegend;
    }

    defaultLegend.content = (props) => ChartContentLegend({
        params: props as LegendContentProps,
        legend: defaultLegend
    });

    return defaultLegend;
}


type AxisItem = {
    x: XAxisProps;
    y: YAxisProps;
    z: ZAxisProps;
}

type BuildAxisParams = {
    type: TChart,
    layout: TLayout,
    xAxis?: Array<XAxisProps>,
    yAxis?: Array<YAxisProps>,
    zAxis?: Array<ZAxisProps>,
    withPercentFormatter?: boolean,
    withAxisCurrencyTickFormatter?: boolean
}

export function buildAxis({
                              type,
                              layout,
                              xAxis,
                              yAxis,
                              zAxis,
                              withPercentFormatter,
                              withAxisCurrencyTickFormatter
                          }: BuildAxisParams): AxisProps {
    const axisItem: AxisItem = {
        x: (layout === 'vertical')
            ? { key: 'x-axis-0', dataKey: 'name' }
            : { key: 'x-axis-0', type: 'number' },
        y: (layout === 'vertical')
            ? { key: 'y-axis-0', width: 'auto' }
            : { key: 'y-axis-0', type: 'category', width: 90, dataKey: 'name' },
        z: { key: 'z-axis-0', type: 'number', range: [100, 100] }
    };

    if (type === 'scatter') {
        axisItem.x = { key: 'x-axis-0', unit: 'cm', type: 'number', name: 'stature', dataKey: 'x' };
        axisItem.y = { key: 'y-axis-0', unit: 'kg', type: 'number', name: 'weight', dataKey: 'y', width: 'auto' };
        axisItem.z = { key: 'z-axis-0', type: 'number', range: [100, 100] };
    }

    if (type === 'line') {
        axisItem.x = { key: 'x-axis-0', dataKey: 'name' };
        axisItem.y = { key: 'y-axis-0', width: 'auto' };
    }

    const x: Array<XAxisProps> = xAxis ?? [axisItem.x];
    const y: Array<YAxisProps> = yAxis ?? [axisItem.y];
    const zList: Array<ZAxisProps> = zAxis ?? [axisItem.z];

    const xList = x.map((item) => {
        if (withAxisCurrencyTickFormatter) {
            item.tickFormatter = layout === 'vertical' ? undefined : (value: number) => currencyFormatter(value);
        }
        return item;
    });

    const yList = y.map((item) => {
        if (withAxisCurrencyTickFormatter) {
            item.tickFormatter = layout === 'vertical' ? (value: number) => currencyFormatter(value) : undefined;
        }
        if (withPercentFormatter) {
            item.tickFormatter = (value) => convertToPercent(value);
        }
        return item;
    });


    return { xList, yList, zList }
}