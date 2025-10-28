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

export default function BarChart ({
    top,
    data,
    xAxis,
    yAxis,
    labels = [],
    tooltipContent
}: BarChartProps) {
    const { isMobile } = useBreakpoint();

    const list = useMemo(() => {
        const limitedData = typeof top === 'number' ? data.slice(0, top) : data;
        return limitedData.filter((item) => item !== undefined);
    }, [data, top])

    const axis = useMemo(() => {
        const yList: Array<YAxisProps> = !yAxis ? [{
            width: 'auto'
        }] : yAxis;

        const xList: Array<XAxisProps> = !xAxis ? [{
            dataKey: 'name'
        }] : xAxis;

        return { yList, xList }
    }, [yAxis, xAxis]);

    const chartMargin = isMobile
        ? { top: 20, right: 20, left: 20, bottom: 20 }
        : { top: 30, right: 30, left: 100, bottom: 30 };

    return (
        <div data-testid="ds-bar-chart" className="ds-bar-chart__container">
            <ResponsiveContainer className="bar-chart-responsive" width="100%" height={isMobile ? 220 : 310}>
                <BarChartComponent
                    data={list}
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
                    <Legend/>
                    <BarContent data={list} labels={labels}/>
                </BarChartComponent>
            </ResponsiveContainer>
        </div>
    )
}