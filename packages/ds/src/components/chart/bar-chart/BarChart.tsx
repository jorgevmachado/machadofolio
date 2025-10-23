import React, { useMemo } from 'react';

import {
    BarChart as BarChartComponent,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { currencyFormatter } from '@repo/services';

import { useBreakpoint } from '../../../hooks';

import { DataChartItem, AxisProps, ChartTooltipProps } from '../types';

import BarChartContent from './bar-chart-content';

import './BarChart.scss';

type BarChartProps = {
    data: Array<DataChartItem>;
    type?: 'vertical' | 'horizontal'
    tooltipContent?: (params: ChartTooltipProps) => React.ReactNode;
};

export default function BarChart({
    type = 'horizontal',
    data,
    tooltipContent,
}: BarChartProps) {
    const isVertical = type === 'vertical';
    const { isMobile } = useBreakpoint();

    const formatAxis = (value: number) => {
        return currencyFormatter(value);
    };

    const axis = useMemo(() => {
        const x = {
            type: isVertical ? undefined : 'number',
            width: undefined,
            dataKey: isVertical ? 'name' : undefined,
            tickFormatter: isVertical ? undefined : formatAxis,
        }
        const y = {
            type: isVertical ? undefined : 'category',
            width: isVertical ? undefined : 90,
            dataKey: isVertical ? undefined : 'name',
            tickFormatter: isVertical ? formatAxis : undefined,
        }

        return { x, y } as AxisProps;
    }, []);

    const chartMargin = isMobile
        ? { top: 20, right: 20, left: 20, bottom: 20 }
        : { top: 30, right: 30, left: 100, bottom: 30 };

    return (
        <div data-testid="ds-bar-chart" className="bar-chart-container">
            <ResponsiveContainer className="bar-chart-responsive" width="100%" height={isMobile ? 220 : 310}>
                <BarChartComponent
                    data={data}
                    layout={type === 'horizontal' ? 'vertical' : 'horizontal'}
                    margin={chartMargin}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis {...axis.x}/>
                    <YAxis {...axis.y}/>
                    <Tooltip content={tooltipContent}/>
                    <BarChartContent data={data} isVertical={isVertical} />
                </BarChartComponent>
            </ResponsiveContainer>
        </div>
    )
}