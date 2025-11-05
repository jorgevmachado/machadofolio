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
import TooltipPercent from './tooltip-percent';
import ChartContentTooltip from './chart-content-tooltip';
import { TooltipContentProps } from './chart-content-tooltip/types';


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

function buildTooltipContent(tooltip: TooltipProps) {
    if(tooltip.content) {
        return tooltip.content;
    }
    console.log('# => tooltip => ', tooltip?.withContent)
    console.log('# => tooltip =>  false => ', tooltip?.withContent === false)

    if (tooltip?.withContent === false) {
        console.log('# => fuck you => not content');
        return undefined;
    }

    if (tooltip?.withDefaultTooltip) {
        console.log('# => fuck you => default');
        return (props: any) => (<ChartTooltip {...props} {...tooltip}/>);
    }

    if (tooltip?.filterContent) {
        console.log('# => fuck you => filter');
        return (props: any) => <FilteredChart filteredTooltip={{ ...props, filterContent: tooltip.filterContent }}/>
    }

    if (tooltip?.withPercentFormatter) {
        console.log('# => fuck you => percent');
        return (props: any) => (<TooltipPercent {...props} />);
    }

    // return tooltip?.content;
    return (props: any) => (<ChartTooltip {...props} {...tooltip}/>);
}

function buildTooltip(tooltip: TooltipProps | undefined, chartTooltip: ChartTooltipParams | undefined) {
    const defaultTooltip: TooltipProps = { ...tooltip };
    console.log('# => defaultTooltip => ', defaultTooltip)

    if(tooltip?.show === false) {
        return undefined;
    }

    if(defaultTooltip.content) {
        return defaultTooltip;
    }


    // defaultTooltip.content = buildTooltipContent({...defaultTooltip, ...chartTooltip});
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
                        tooltipContent={getTooltipContent(chartTooltip, tooltipContent)}
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
        </ChartContent>
    );
};
