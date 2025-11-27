import React from 'react';

import {
    ComposedChart as ComposedChartComponent,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Area,
    Bar, Line, Scatter
} from 'recharts';

import type { ComposedChartProps } from './types';

const defaultStyle = { width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 };

const defaultMargin = {
    top: 20,
    right: 0,
    bottom: 0,
    left: 0,
}

export default function ComposedChart({
                                          axis,
                                          data,
                                          bars,
                                          areas,
                                          lines,
                                          style,
                                          layout = 'horizontal',
                                          margin,
                                          legend,
                                          tooltip,
                                          scatters,
                                          responsive,
                                          cartesianGrid,
                                      }: Readonly<ComposedChartProps>) {

    const currentStyle = { ...defaultStyle, ...style};

    const currentMargin = { ...defaultMargin, ...margin };

    const currentCartesianGrid = cartesianGrid ?? { stroke: '#f5f5f5' };

    return (
        <ComposedChartComponent
            data={data}
            style={currentStyle}
            layout={layout}
            margin={currentMargin}
            responsive={responsive}
        >
            <CartesianGrid {...currentCartesianGrid} />

            {(axis && axis?.xList && axis?.xList.length > 0) && axis?.xList.map(({key, ...x}, index) => (
                <XAxis key={`${key}-${index}`} {...x} data-testid={`ds-composed-chart-x-axis-${index}`}/>
            ))}

            {(axis && axis?.yList && axis?.yList?.length > 0) && axis?.yList.map(({key, ...y}, index) => (
                <YAxis key={`${key}-${index}`} {...y} data-testid={`ds-composed-chart-y-axis-${index}`}/>
            ))}

            {tooltip && (
                <Tooltip {...tooltip} />
            )}

            {legend && (
                <Legend {...legend}  />
            )}

            {(areas && areas.length > 0) && areas.map (({key, ...area}, index) => (
                <Area key={`${key}-${index}`} {...area}  data-testid={`ds-composed-chart-area-${index}`}/>
            ))}

            {(bars && bars.length > 0) && bars.map(({key, ...bar}, index) => (
                <Bar key={`${key}-${index}`} {...bar} data-testid={`ds-composed-chart-bar-${index}`}/>
            ))}

            {(scatters && scatters.length > 0) && scatters.map(({key, ...scatter}, index) => (
                <Scatter key={`${key}-${index}`} {...scatter} data-testid={`ds-composed-chart-scatter-${index}`}/>
            ))}

            {(lines && lines.length > 0) && lines.map(({key, ...line}, index) => (
                <Line key={`${key}-${index}`} {...line} data-testid={`ds-composed-chart-line-${index}`} />
            ))}

        </ComposedChartComponent>
    );
};