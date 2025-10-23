import React from 'react';

import { PieChart as PieChartComponent, Cell, Legend, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipProps, DataChartItem } from '../types';

type PieChartProps = {
    data: Array<DataChartItem>;
    tooltipContent?: (params: ChartTooltipProps) => React.ReactNode;
};


export default function PieChart({ data, tooltipContent }: PieChartProps) {

    return (
        <div data-testid="ds-pie-chart">
            <ResponsiveContainer width="100%" height={300}>
                <PieChartComponent>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={tooltipContent}/>
                    <Legend />
                </PieChartComponent>
            </ResponsiveContainer>
        </div>
    )
}