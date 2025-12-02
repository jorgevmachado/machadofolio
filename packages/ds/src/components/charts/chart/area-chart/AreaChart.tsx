import React, { useMemo } from 'react';

import { curveCardinal } from 'd3-shape';
import { Area, AreaChart as AreaChartComponent, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

import { mapListColors } from '../../colors';

import LinearGradient from './linear-gradient';
import type { AreaChartLabelsItem, AreaChartProps } from './types';

const defaultStyle = {
    width: '100%',
    maxWidth: '700px',
    maxHeight: '70vh',
    aspectRatio: 1.618
}

const defaultMargin = {
    top: 20,
    left: 0,
    right: 0,
    bottom: 0
}

export default function AreaChart({
                                      axis,
                                      data,
                                      style,
                                      margin,
                                      syncId,
                                      labels = [],
                                      legend,
                                      tooltip,
                                      responsive,
                                      stackOffset,
                                      linearGradient,
                                  }: Readonly<AreaChartProps>) {
    const list = useMemo(() => {
        return mapListColors<AreaChartLabelsItem>(labels).map((label) => ({
            ...label,
            type: !label?.curveCardinalTension ? label.type : curveCardinal.tension(label?.curveCardinalTension)
        }))
    }, [labels]);

    const currentStyle = { ...defaultStyle, ...style };

    const currentMargin = { ...defaultMargin, ...margin };

    return (
        <AreaChartComponent
            data={data}
            style={currentStyle}
            syncId={syncId}
            margin={currentMargin}
            responsive={responsive}
            stackOffset={stackOffset}
        >
            <CartesianGrid strokeDasharray="3 3"/>

            {(axis && axis?.xList && axis?.xList?.length > 0) && axis.xList.map((item) => (
                <XAxis {...item} />
            ))}

            {(axis && axis?.yList && axis?.yList?.length > 0) && axis.yList.map((item) => (
                <YAxis {...item} />
            ))}

            {tooltip && (
                <Tooltip {...tooltip}/>
            )}

            {linearGradient && (
                <LinearGradient {...linearGradient} data={data}/>
            )}

            {legend && (
                <Legend {...legend} />
            )}


            {list?.map((label, index) => (
                <Area
                    key={`${label.key}-${index}`}
                    fill={label?.fill}
                    type={label.type}
                    stroke={label?.stroke}
                    dataKey={label.dataKey}
                    stackId={label.stackId}
                    data-testid={`ds-area-chart-area-${index}`}
                />
            ))}
        </AreaChartComponent>
    )

}