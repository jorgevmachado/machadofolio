import React from 'react';

import {
    TChart,
    TWrapper,
    TooltipProps,
    LegendProps,
} from './types';

import ChartContainer from './chart-container';
import FilteredChart from './filtered-chart';

import { ChartContentTooltip, type TooltipContentProps } from './chart-content-tooltip';

import {
    type BarChartProps,
    type PieChartProps,
    type AreaChartProps,
    type RadarChartProps,
    type RadialChartProps,
    type LineChartProps,
    type ScatterChartProps,
    BarChart,
    PieChart,
    AreaChart,
    RadarChart,
    RadialChart,
    LineChart,
    ScatterChart,
    ComposedChart, ComposedChartProps
} from './charts';

import './SuperChart.scss';


type SuperChartProps = Readonly<{
    type?: TChart;
    title: string;
    legend?: LegendProps;
    tooltip?: TooltipProps;
    barChart?: BarChartProps;
    pieChart?: PieChartProps;
    subtitle?: string;
    fallback?: string;
    children?: React.ReactNode;
    className?: string;
    areaChart?: AreaChartProps;
    lineChart?: LineChartProps;
    radarChart?: RadarChartProps;
    radialChart?: RadialChartProps;
    wrapperType?: TWrapper;
    scatterChart?: ScatterChartProps;
    composedChart?: ComposedChartProps;
}>;

function buildTooltip(tooltip?: TooltipProps) {
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

function buildLegend(legend?: LegendProps) {
    const defaultLegend: LegendProps = { ...legend };

    if(defaultLegend?.show === false) {
        return undefined;
    }

    if (defaultLegend?.filterContent) {
        return {
            ...legend,
            content: (props: any) => <FilteredChart filteredLegend={{ ...props, filterContent: defaultLegend.filterContent }} />
        };
    }
    return { ...defaultLegend };
}

export default function SuperChart({
    type = 'bar',
    title,
    legend,
    tooltip,
    subtitle,
    fallback = 'No data available',
    barChart,
    pieChart,
    children,
    className,
    areaChart,
    lineChart,
    radarChart,
    radialChart,
    wrapperType,
    scatterChart,
    composedChart,
}: SuperChartProps) {

    const isFallback = () => {
        const result = {
            length: 0
        }

        switch (type) {
            case 'bar':
                result.length = barChart?.data?.length || 0;
                break;
            case 'pie':
                result.length = pieChart?.data?.length || 0;
                break;
            case 'area':
                result.length = areaChart?.data?.length || 0;
                break;
            case 'radar':
                result.length = radarChart?.data?.length || 0;
                break;
            case 'radial':
                result.length = radialChart?.data?.length || 0;
                break;
            case 'line':
                result.length = lineChart?.data?.length || 0;
                break;
            case 'scatter':
                result.length = scatterChart?.data?.length || 0;
                break;
            case 'composed':
                result.length = composedChart?.data?.length || 0;
                break;
            default:
                result.length = 0;
        }
        return result.length <= 0;
    }

    const currentTooltip = buildTooltip(tooltip);
    const currentLegend = buildLegend(legend);

    return (
        <ChartContainer
            title={title}
            subtitle={subtitle}
            fallback={fallback}
            className={className}
            isFallback={isFallback()}
            wrapperType={wrapperType}
        >
            {
                (type === 'bar' && barChart) && (
                    <BarChart
                        {...barChart}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'pie' && pieChart) && (
                    <PieChart
                        {...pieChart}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'area' && areaChart) && (
                        <AreaChart
                            {...areaChart}
                            tooltip={currentTooltip}
                        />
                )
            }
            {
                (type === 'radar' && radarChart) && (
                    <RadarChart
                        {...radarChart}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'radial' && radialChart ) && (
                    <RadialChart
                        {...radialChart}
                        tooltip={currentTooltip}
                    />

                )
            }
            {
                (type === 'line' && lineChart ) && (
                    <LineChart
                        {...lineChart}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'scatter' && scatterChart ) && (
                    <ScatterChart
                        {...scatterChart}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'composed' && composedChart) && (
                    <ComposedChart
                        {...composedChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                    />
                )
            }
            {children}
        </ChartContainer>
    );
};
