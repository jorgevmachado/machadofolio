import React from 'react';

import { Scatter, ScatterChart, Tooltip, TooltipContentProps, XAxis, YAxis, ZAxis } from 'recharts';

import { ScatterChartDataItem } from '../type';
import { MarginProps, TooltipProps, XAxisProps, YAxisProps, ZAxisProps } from '../../../types';

type AxisProps = {
    x: XAxisProps;
    y: YAxisProps;
    z: ZAxisProps;
}

type BubbleScatterChartProps = {
    data: Array<ScatterChartDataItem>;
    axis: AxisProps;
    range?: [number, number];
    style: React.CSSProperties;
    domain?: Array<number>;
    margin?: MarginProps;
    tooltip?: TooltipProps;
    responsive?: boolean;
    bubbleStyle?: React.CSSProperties;
};

type BubbleAxesProps = {
    axis: AxisProps;
    name: string;
    range?: [number, number];
    domain?: Array<number>;
    showXTicks?: boolean;
}

const renderTooltip = (props: TooltipContentProps<string | number, string>) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
        const data = payload[0] && payload[0].payload;

        return (
            <div
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid #999',
                    margin: 0,
                    padding: 10,
                }}
            >
                <p>{data.hour}</p>
                <p>
                    <span>value: </span>
                    {data.value}
                </p>
            </div>
        );
    }

    return null;
};

const BubbleAxes = ({ axis, name, range = [16, 225], domain, showXTicks = false }: BubbleAxesProps) => {
    return (
        <>
            <XAxis
                {...axis.x}
                tick={showXTicks || { fontSize: 0 }}
            />
            <YAxis
                {...axis.y}
                label={{  value: name }}
            />
            <ZAxis {...axis.z} domain={domain} range={range} />
        </>
    )
};

export default function BubbleScatterChart({
    data,
    axis,
    range,
    style,
    margin,
    domain,
    tooltip,
    responsive,
    bubbleStyle
}: BubbleScatterChartProps) {
    return (
        <div style={bubbleStyle} data-testid="ds-bubble-scatter-chart">
            { data.map((item, index) => (
                <ScatterChart
                    key={`ds-bubble-scatter-chart-${index}`}
                    style={style}
                    margin={margin}
                    responsive={responsive}>
                    <BubbleAxes
                        axis={axis}
                        range={range}
                        name={item?.name || ''}
                        domain={domain}
                        showXTicks={Boolean(item?.showTicks)}
                    />
                    <Scatter data={item.data} fill={item?.fill || '#8884d8'} />
                    <Tooltip {...tooltip} />
                    {/*<Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />*/}
                </ScatterChart>
            ))}

        </div>
    )
}