import React from 'react';

import type {
    TChart,
    TWrapper,
    ChartTooltipParams,
} from './types';

import ChartContent from './chart-content';
import ChartTooltip from './chart-tooltip';
import { BarChart, type BarChartProps } from './charts';

import './SuperChart.scss';

type SuperChartProps = {
    type?: TChart;
    title: string;
    barChart?: BarChartProps;
    subtitle?: string;
    fallback?: string;
    children?: React.ReactNode;
    className?: string;
    wrapperType?: TWrapper;
    chartTooltip?: ChartTooltipParams;
    tooltipContent?: (params: ChartTooltipParams) => React.ReactNode;
}

export default function SuperChart({
    type = 'bar',
    title,
    subtitle,
    fallback = 'No data available',
    barChart,
    children,
    className,
    wrapperType,
    chartTooltip,
    tooltipContent
}: SuperChartProps) {

    const isFallback = () => {
        if (type === 'bar' && barChart) {
            const { data } = barChart;
            return data.length <= 0;
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
            {children}
        </ChartContent>
    );
};
