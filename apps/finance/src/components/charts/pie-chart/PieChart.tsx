'use client'
import React, { useMemo } from 'react';

import { PieChart as PieChartComponent, Cell, Legend, Pie, ResponsiveContainer, Tooltip } from 'recharts';

import type { DataItemProps, TooltipProps } from '../types';

import ContentChart from '../content-chart';

type PieChartProps = {
    data: Array<Omit<DataItemProps, 'color'>>;
    title: string;
    total?: number;
    subtitle?: string;
    fallback?: string;
    className?: string;
    tooltipContent?: (params: TooltipProps) => React.ReactNode;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function PieChart({ data, total = 0, tooltipContent, ...props }: PieChartProps) {
    const list = useMemo(() => {
        return data.map((item, index) => ({
            ...item,
            color: COLORS[index % COLORS.length],
            percentageTotal: total,
        })).filter((item) => item !== undefined);
    }, [data, total])

    return (
        <ContentChart {...props} isFallback={data.length <= 0}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChartComponent>
                    <Pie
                        data={list}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {list.map((entry) => (
                            <Cell key={`cell-${entry.type}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={tooltipContent}/>
                    <Legend />
                </PieChartComponent>
            </ResponsiveContainer>
        </ContentChart>
    );
}