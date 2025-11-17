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

import type { BarChartProps } from './types';
import { mapColors } from '../../colors';

export default function BarChart ({
    top,
    axis,
    data,
    labels = [],
    legend,
    layout = 'vertical',
    tooltip,
}: Readonly<BarChartProps>) {
    const { isMobile } = useBreakpoint();

    const isVertical = layout === 'vertical';

    const list = useMemo(() => {
        const limitedData = typeof top === 'number' ? data.slice(0, top) : data;
        const filteredList = limitedData.filter((item) => item !== undefined);
        return filteredList.map((item) => {
            if(item.type === 'bank') {
                const colors = mapColors({ type: 'bank', name: item.name })
                if(!item.fill && colors?.fill) {
                    item.fill = colors?.fill;
                }
                if(!item.color && colors?.color) {
                    item.color = colors?.color;
                }
                if(!item.stroke && colors?.stroke) {
                    item.stroke = colors?.stroke;
                }
            }
            return item;
        });
    }, [data, top])

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

                    { (axis?.xList && axis.xList.length > 0) && axis?.xList?.map(({ key, ...x}) => (
                        <XAxis key={key} {...x}/>
                    ))}

                    { (axis?.yList && axis.yList.length > 0) && axis?.yList?.map(({ key, ...y}) => (
                        <YAxis key={key} {...y}/>
                    ))}

                    { tooltip && (
                        <Tooltip {...tooltip}/>
                    )}

                    {legend &&  (
                            <Legend {...legend}/>
                    )}

                    <BarContent data={list} labels={labels} isVertical={isVertical}/>
                </BarChartComponent>
            </ResponsiveContainer>
        </div>
    )
}