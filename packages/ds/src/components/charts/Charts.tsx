import React from 'react';

import { ChartsProps, } from './types';

import ChartContainer from './chart-container';

import {
    AreaChart,
    BarChart,
    ComposedChart,
    LineChart,
    PieChart,
    RadarChart,
    RadialChart,
    ScatterChart
} from './chart';

import './Charts.scss';
import { buildAxis, buildLegend, buildTooltip } from './utils';

export default function Charts({
                                       type = 'bar',
                                       title,
                                       xAxis,
                                       yAxis,
                                       zAxis,
                                       layout = 'vertical',
                                       legend,
                                       tooltip,
                                       subtitle,
                                       fallback = 'No data available',
                                       barChart,
                                       pieChart,
                                       children,
                                       className,
                                       responsive,
                                       areaChart,
                                       lineChart,
                                       radarChart,
                                       radialChart,
                                       wrapperType,
                                       scatterChart,
                                       composedChart,
                                       withAxisCurrencyTickFormatter
                                   }: ChartsProps) {

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
                if (!lineChart?.data && lineChart?.labels) {
                    result.length = lineChart?.labels?.length;
                    break;
                }
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
    const axis = buildAxis({
        type,
        layout,
        xAxis,
        yAxis,
        zAxis,
        withPercentFormatter: tooltip?.withPercentFormatter,
        withAxisCurrencyTickFormatter
    });

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
                        axis={axis}
                        layout={layout}
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
                        responsive={responsive}
                    />
                )
            }
            {
                (type === 'area' && areaChart) && (
                    <AreaChart
                        {...areaChart}
                        axis={axis}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                        responsive={responsive}
                    />
                )
            }
            {
                (type === 'radar' && radarChart) && (
                    <RadarChart
                        {...radarChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                        responsive={responsive}
                    />
                )
            }
            {
                (type === 'radial' && radialChart) && (
                    <RadialChart
                        {...radialChart}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                        responsive={responsive}
                    />

                )
            }
            {
                (type === 'line' && lineChart) && (
                    <LineChart
                        {...lineChart}
                        axis={axis}
                        layout={layout}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                        responsive={responsive}
                    />
                )
            }
            {
                (type === 'scatter' && scatterChart) && (
                    <ScatterChart
                        {...scatterChart}
                        axis={axis}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                        responsive={responsive}
                    />
                )
            }
            {
                (type === 'composed' && composedChart) && (
                    <ComposedChart
                        {...composedChart}
                        axis={axis}
                        legend={currentLegend}
                        tooltip={currentTooltip}
                        responsive={responsive}
                    />
                )
            }
            {children}
        </ChartContainer>
    );
};
