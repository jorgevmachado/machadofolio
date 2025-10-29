import React, { useMemo } from 'react';

import {
    BarChart as BarChartComponent,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { useBreakpoint } from '../../../../hooks';

import BarContent from './bar-content';

import type { BarChartProps, XAxisProps, YAxisProps } from './types';
import { currencyFormatter } from '@repo/services';

export default function BarChart ({
    top,
    data,
    xAxis,
    yAxis,
    labels = [],
    layout = 'vertical',
    tooltipContent,
    withCurrencyTickFormatter
}: BarChartProps) {
    const { isMobile } = useBreakpoint();

    const isVertical = layout === 'vertical';

    const list = useMemo(() => {
        const limitedData = typeof top === 'number' ? data.slice(0, top) : data;
        return limitedData.filter((item) => item !== undefined);
    }, [data, top])

    const formatAxis = (value: number) => {
        return currencyFormatter(value);
    };

    const axis = useMemo(() => {
        const x : XAxisProps = isVertical
            ? { dataKey: 'name' }
            : { type: 'number' };

        const y: YAxisProps = isVertical
            ? { width: 'auto' }
            : {
                type: 'category',
                width: 90,
                dataKey: 'name'
            };

        if(withCurrencyTickFormatter) {
            x.tickFormatter = isVertical ? undefined : formatAxis;
            y.tickFormatter = isVertical ? formatAxis : undefined;
        }

        const xList: Array<XAxisProps> = !xAxis ? [x] : xAxis;

        const yList: Array<YAxisProps> = !yAxis ? [y] : yAxis;

        return { xList, yList }
    }, [xAxis, yAxis, withCurrencyTickFormatter]);

    const chartMargin = isMobile
        ? { top: 20, right: 20, left: 20, bottom: 20 }
        : { top: 30, right: 30, left: 100, bottom: 30 };

    return (
        <div data-testid="ds-bar-chart" className="ds-bar-chart__container">
            <ResponsiveContainer className="bar-chart-responsive" width="100%" height={isMobile ? 220 : 310}>
                <BarChartComponent
                    data={list}
                    layout={layout === 'vertical' ? 'horizontal' : 'vertical'}
                    margin={chartMargin}
                >
                    <CartesianGrid strokeDasharray="3 3"/>

                    {axis.xList.map((x, index) => (
                        <XAxis key={index} {...x}/>
                    ))}

                    {axis.yList.map((y, index) => (
                        <YAxis key={index} {...y}/>
                    ))}

                    <Tooltip content={tooltipContent}/>
                    {isVertical &&  <Legend/> }
                    <BarContent data={list} labels={labels} isVertical={isVertical}/>
                </BarChartComponent>
            </ResponsiveContainer>
        </div>
    )
}