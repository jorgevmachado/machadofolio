import React from 'react';

import type {
    TChart,
    TWrapper,
    ChartTooltipParams, TooltipProps,
} from './types';

import ChartContent from './chart-content';
import ChartTooltip from './chart-tooltip';

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
    ScatterChart
} from './charts';

import './SuperChart.scss';

type SuperChartProps = {
    type?: TChart;
    title: string;
    tooltip?: TooltipProps;
    barChart?: BarChartProps;
    pieChart?: PieChartProps;
    subtitle?: string;
    fallback?: string;
    children?: React.ReactNode;
    className?: string;
    areaChart?: AreaChartProps
    lineChart?: LineChartProps;
    radarChart?: RadarChartProps;
    radialChart?: RadialChartProps;
    wrapperType?: TWrapper;
    scatterChart?: ScatterChartProps;
    chartTooltip?: ChartTooltipParams;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
}

export default function SuperChart({
    type = 'bar',
    title,
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

        return false;
    }

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
                        tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                    />
                )
            }
            {
                (type === 'pie' && pieChart) && (
                    <PieChart
                        {...pieChart}
                        tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                    />
                )
            }
            {
                (type === 'area' && areaChart) && (
                        <AreaChart
                            {...areaChart}
                            tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                        />
                )
            }
            {
                (type === 'radar' && radarChart) && (
                    <RadarChart
                        {...radarChart}
                        tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                    />
                )
            }
            {
                (type === 'radial' && radialChart ) && (
                    <RadialChart
                        {...radialChart}
                        tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                    />

                )
            }
            {
                (type === 'line' && lineChart ) && (
                    <LineChart
                        {...lineChart}
                        tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                    />
                )
            }
            {
                (type === 'scatter' && scatterChart ) && (
                    <ScatterChart
                        {...scatterChart}
                        tooltip={tooltip}
                        tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                    />
                )
            }
            {children}
        </ChartContent>
    );
};
