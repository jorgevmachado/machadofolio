import React from 'react';

import {
    TChart,
    TWrapper,
    TooltipProps,
    LegendProps,
} from './types';

import ChartContainer from './chart-container';

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
import { buildLegend, buildTooltip } from './utils';

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
                        legend={currentLegend}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'pie' && pieChart) && (
                    <PieChart
                        {...pieChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'area' && areaChart) && (
                        <AreaChart
                            {...areaChart}
                            legend={currentLegend}
                            tooltip={currentTooltip}
                        />
                )
            }
            {
                (type === 'radar' && radarChart) && (
                    <RadarChart
                        {...radarChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'radial' && radialChart ) && (
                    <RadialChart
                        {...radialChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                    />

                )
            }
            {
                (type === 'line' && lineChart ) && (
                    <LineChart
                        {...lineChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                    />
                )
            }
            {
                (type === 'scatter' && scatterChart ) && (
                    <ScatterChart
                        {...scatterChart}
                        legend={currentLegend}
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
