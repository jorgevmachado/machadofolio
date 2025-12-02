import React, { useMemo } from 'react';

import { mapListColors } from '../../colors';
import {type TooltipProps } from '../../types';

import BubbleScatterChart from './bubble-scatter-chart';
import type { ScatterChartProps } from './types';

import {
    CartesianGrid,
Cell, LabelList,     Legend,     Scatter,
    ScatterChart as ScatterChartComponent,
type ScatterProps,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis} from 'recharts';

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
    bottom: 0,
}

export default function ScatterChart({
                                         axis,
                                         type = 'scatter',
                                         data,
                                         style,
                                         margin,
                                         layout = 'horizontal',
                                         legend,
                                         tooltip,
                                         responsive = true,
                                         bubbleStyle,
                                     }: ScatterChartProps) {

    const currentStyle = { ...defaultStyle, ...style };

    const currentMargin = { ...defaultMargin, ...margin };

    const currentTooltip = useMemo(() => {
        if(!tooltip) {
            return undefined;
        }

        const defaultTooltip: TooltipProps = {
            cursor: {
                strokeDasharray: '3 3'
            }
        }
        return {...defaultTooltip, ...tooltip};

    }, [tooltip]);

    const list = useMemo(() => {
        return data;
    }, [data])

    const cellList = (data: ScatterProps['data'], withCell?: boolean) => {
        if(withCell && Array.isArray(data)) {
            return mapListColors(data);
        }
        return [];
    }

    return type === 'scatter' ? (
        <ScatterChartComponent
            style={currentStyle}
            layout={layout}
            margin={currentMargin}
            responsive={responsive}
        >
            <CartesianGrid />

            {(axis && axis?.xList && axis?.xList.length > 0) && axis.xList.map(({ key, ...x}, index) => (
                <XAxis {...x} key={key} data-testid={`ds-scatter-chart-x-axis-${index}`} />
            ))}

            {(axis && axis?.yList && axis?.yList?.length > 0) && axis.yList.map(({key, ...y}, index) => (
                <YAxis {...y} key={key} data-testid={`ds-scatter-chart-y-axis-${index}`} />
            ))}

            {(axis && axis?.zList && axis?.zList?.length > 0) && axis.zList.map(({ key,...z}, index) => (
                <ZAxis {...z} key={key} data-testid={`ds-scatter-chart-z-axis-${index}`} />
            ))}

            {currentTooltip && (
                <Tooltip {...currentTooltip}/>
            )}

            {legend && (
                <Legend {...legend} />
            )}

            {list.map((item, index) => (
                <Scatter
                    {...item}
                    key={`${item.key}-${index}`}
                    data-testid={`ds-scatter-chart-scatter-${index}`}
                >
                    {item?.labelList && (
                        <LabelList
                            {...item.labelList}
                            data-testid={`ds-scatter-chart-scatter-label-list-${index}`}
                        />
                    )}
                    {cellList(item?.data, item?.withCell).map((cell, cellIndex) => (
                        <Cell
                            key={cell.key}
                            fill={cell.fill}
                            data-testid={`ds-scatter-chart-scatter-${index}-cell-${cellIndex}`}
                        />
                    ))}
                </Scatter>
            ))}

        </ScatterChartComponent>
    ) : (
        <BubbleScatterChart
            axis={{
                x: axis?.xList?.[0],
                y: axis?.yList?.[0],
                z: axis?.zList?.[0],
            }}
            data={list}
            style={currentStyle}
            margin={currentMargin}
            tooltip={currentTooltip}
            responsive={responsive}
            bubbleStyle={bubbleStyle}
        />
    )
}