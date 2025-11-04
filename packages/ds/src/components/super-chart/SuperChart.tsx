import React from 'react';

import {
    TChart,
    TWrapper,
    ChartTooltipParams,
    TooltipProps,
    LegendProps,
} from './types';

import ChartContent from './chart-content';
import ChartTooltip from './chart-tooltip';
import FilteredChart from './filtered-chart';

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
    chartTooltip?: ChartTooltipParams;
    composedChart?: ComposedChartProps;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
}>;

function getTooltipContent(chartTooltip?: ChartTooltipParams, tooltipContent?: ((params: ChartTooltipParams) => React.ReactNode)) {
    if (chartTooltip) {
        return (params: any) => (<ChartTooltip {...params} {...chartTooltip}/>);
    }
    return tooltipContent;
}

function buildTooltip(tooltip: TooltipProps | undefined, chartTooltip: ChartTooltipParams | undefined) {
    const defaultTooltip: TooltipProps = { ...tooltip };

    if(tooltip?.show === false) {
        return undefined;
    }

    const baseContent = chartTooltip
        ? (params: any) => (<ChartTooltip {...params} {...chartTooltip}/>)
        : defaultTooltip?.content;

    if(defaultTooltip?.withContent === false) {
        return { ...defaultTooltip, content: undefined };
    }

    if (defaultTooltip?.filterContent) {
        return {
            ...defaultTooltip,
            content: (props: any) => <FilteredChart filteredTooltip={{ ...props, filterContent: defaultTooltip.filterContent }} />
        };
    }
    return { ...defaultTooltip, content: baseContent };
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
    chartTooltip,
    scatterChart,
    composedChart,
    tooltipContent
}: SuperChartProps) {

    const isFallback = () => {
        if (type === 'bar' && barChart) {
            const { data = []} = barChart;
            return data.length <= 0;
        }

        if(type === 'pie' && pieChart) {
            const { data = [] } = pieChart;
            return data.length <= 0;
        }

        if(type === 'area' && areaChart) {
            const { data = [] } = areaChart;
            return data.length <= 0;
        }

        if(type === 'radar' && radarChart) {
            const { data = [] } = radarChart;
            return data.length <= 0;
        }

        if(type === 'radial' && radialChart) {
            const { data = [] } = radialChart;
            return data?.length <= 0;
        }

        if(type === 'line' && lineChart) {
            const { data = [] } = lineChart;
            return data?.length <= 0;
        }

        if(type === 'scatter' && scatterChart) {
            const { data = [] } = scatterChart;
            return data?.length <= 0;
        }

        if(type === 'composed' && composedChart) {
            const { data = [] } = composedChart;
            return data?.length <= 0;
        }

        return false;
    }

    const currentTooltip = buildTooltip(tooltip, chartTooltip);
    const currentLegend = buildLegend(legend);

    return (
        <ChartContent
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
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                    />
                )
            }
            {
                (type === 'pie' && pieChart) && (
                    <PieChart
                        {...pieChart}
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                    />
                )
            }
            {
                (type === 'area' && areaChart) && (
                        <AreaChart
                            {...areaChart}
                            tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                        />
                )
            }
            {
                (type === 'radar' && radarChart) && (
                    <RadarChart
                        {...radarChart}
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                    />
                )
            }
            {
                (type === 'radial' && radialChart ) && (
                    <RadialChart
                        {...radialChart}
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                    />

                )
            }
            {
                (type === 'line' && lineChart ) && (
                    <LineChart
                        {...lineChart}
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                    />
                )
            }
            {
                (type === 'scatter' && scatterChart ) && (
                    <ScatterChart
                        {...scatterChart}
                        tooltip={tooltip}
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
                    />
                )
            }
            {
                (type === 'composed' && composedChart) && (
                    <ComposedChart
                        {...composedChart}
                        tooltip={currentTooltip}
                        legend={currentLegend}
                    />
                )
            }
            {children}
        </ChartContent>
    );
};
