import React from 'react';

import { Bar, Cell, LabelList, Legend } from 'recharts';

import type { DataChartItem } from '../../types';


type BarChartContentProps = {
    data: Array<DataChartItem>;
    isVertical: boolean;
};

type BarProps = {
    fill?: string;
    radius?: number | [number, number, number, number];
    dataKey: string
}

export default function BarChartContent({
    data,
    isVertical
}: BarChartContentProps) {
    const props: BarProps = {
        fill: isVertical ? '#8884d8' : undefined,
        radius: isVertical ? [8, 8, 0, 0] : [0, 8, 8, 0],
        dataKey: 'value',
    }

    return (
        <>
            {isVertical && <Legend/>}
            <Bar {...props} radius={props.radius}>
                {isVertical && data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color}/>
                ))}
                {isVertical && <LabelList dataKey="value" position="top" />}
            </Bar>
        </>
    )

}