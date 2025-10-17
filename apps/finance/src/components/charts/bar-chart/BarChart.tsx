'use client';
import React, { useMemo } from 'react';

import {
    Bar,
    BarChart as BarChartComponent,
    CartesianGrid,
    Cell, Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    LabelList
} from 'recharts';

import { currencyFormatter, normalize, snakeCaseToNormal, toSnakeCase } from '@repo/services';


import { AxisProps, DataItemProps, TooltipProps } from '../types';

import ContentChart from '../content-chart';

type BarChartProps = {
    top?: number;
    type: 'vertical' | 'horizontal'
    data: Array<Omit<DataItemProps, 'color'>>;
    title: string;
    children?: React.ReactNode;
    subtitle?: string;
    fallback?: string;
    className?: string;
    tooltipContent?: (params: TooltipProps) => React.ReactNode;
}

const FALLBACK_COLOR = {
    name: 'other',
    color: '#10b981'
}

const COLORS =[
    {
        name: 'nubank',
        color: '#8b5cf6'
    },
    {
        name: 'caixa',
        color: '#3b82f6'
    },
    {
        name: 'itau',
        color: '#f59e0b'
    },
    {
        name: 'banco_do_brasil',
        color: '#FFD700'
    },
    {
        name: 'santander',
        color: '#ef4444'
    }
];

export default function BarChart({
    top = 5,
    type,
    data,
    children,
    tooltipContent,
    ...props
}: BarChartProps) {

    const isVertical = type === 'vertical';

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

    const list = useMemo(() => {
        const mapColors = (type: string, name: string, index: number): string => {
            if(type === 'bank') {
                const currentName = toSnakeCase(normalize(name));
                return (COLORS.find((item) => item.name === currentName) ?? FALLBACK_COLOR).color;
            }
            const colors = COLORS.flatMap((item) => item.color);
            return colors[index % colors.length] ?? FALLBACK_COLOR.color;
        }
        return [...(data ?? [])]
            .sort((a, b) => b.value - a.value)
            .slice(0, top)
            .map((item, index) => {
                const color = mapColors(item.type, item.name, index);
                return {
                    ...item,
                    name: snakeCaseToNormal(item.name),
                    fill: color,
                    color
                }
            }).filter((item) => item !== undefined);
    }, [data, top]);

    const RenderBarContent = () => {
        const props: { fill?: string; radius?: number | [number, number, number, number]; dataKey: string} = {
            fill: isVertical ? '#8884d8' : undefined,
            radius: isVertical ? [8, 8, 0, 0] : [0, 8, 8, 0],
            dataKey: 'value',
        }

        return (
            <>
                {isVertical && <Legend/>}
                <Bar {...props} radius={props.radius}>
                    {isVertical && list.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))}
                    {isVertical && <LabelList dataKey="value" position="top" />}
                </Bar>
            </>
        )
    }


    return (
        <ContentChart {...props} isFallback={data.length <= 0}>
            <ResponsiveContainer width="100%" height={310}>
                <BarChartComponent data={list} layout={type === 'horizontal' ? 'vertical' : 'horizontal'}
                                   margin={{ top: 30, right: 30, left: 100, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis {...axis.x}/>
                    <YAxis {...axis.y}/>
                    <Tooltip content={tooltipContent}/>
                    <RenderBarContent/>
                </BarChartComponent>
            </ResponsiveContainer>
            {children}
        </ContentChart>
    );
}