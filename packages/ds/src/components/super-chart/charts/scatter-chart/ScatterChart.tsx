import React, { useMemo } from 'react';

import {
    ScatterChart as ScatterChartComponent,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend, LabelList, Cell, ScatterProps
} from 'recharts';

import { XAxisProps, YAxisProps, ZAxisProps, TooltipProps } from '../../types';

import { getRandomHarmonicPalette } from '../../colors';

import type { ScatterChartProps } from './type';

import BubbleScatterChart from './bubble-scatter-chart';

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
    type = 'scatter',
    data,
    style,
    margin,
    xAxis,
    yAxis,
    zAxis,
    layout = 'horizontal',
    tooltip,
    withLegend,
    responsive = true,
    bubbleStyle,
}: ScatterChartProps) {

    const currentStyle = { ...defaultStyle, ...style };

    const currentMargin = { ...defaultMargin, ...margin };

    const axis = useMemo(() => {
        const xDefault: XAxisProps = { key: 'x-axis-0', unit: 'cm', type: 'number', name: 'stature', dataKey: 'x' };
        const yDefault: YAxisProps = { key: 'y-axis-0', unit: 'kg', type: 'number', name: 'weight',  dataKey: 'y', width: 'auto' };
        const zDefault: ZAxisProps = { key: 'z-axis-0', type: 'number', range: [100, 100] };

        const xList: Array<XAxisProps> = (xAxis ?? [xDefault]).map((x, index) => ({
            ...x,
            key: `x-axis-${index}`,
        }));

        const yList: Array<YAxisProps> = (yAxis ?? [yDefault]).map((y, index) => ({
            ...y,
            key: `y-axis-${index}`,
        }));

        const zList: Array<ZAxisProps> = (zAxis ?? [zDefault]).map((z, index) => ({
            ...z,
            key: `z-axis-${index}`,
        }));

        const x: XAxisProps = xList[0] as XAxisProps;
        const y = yList[0] as YAxisProps;
        const z = zList[0] as ZAxisProps;

        return { xList, yList, zList, x, y, z }
    }, [xAxis, yAxis, zAxis]);

    const currentTooltip = useMemo(() => {
        const defaultTooltip: TooltipProps = {
            cursor: {
                strokeDasharray: '3 3'
            }
        }
        if(!tooltip) {
            return undefined;
        }
        return {...defaultTooltip, ...tooltip};

    }, [tooltip]);

    const list = useMemo(() => {
        return data;
    }, [data])

    const cellList = (data: ScatterProps['data'], withCell?: boolean) => {
        if(withCell && Array.isArray(data)) {
            return data.map((item, index) => {
                const { fill } = getRandomHarmonicPalette();
                return {
                    ...item,
                    key: `cell-${index}`,
                    fill: item?.fill || fill,
                }
            })
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

            {axis.xList.map(({ key, ...x}, index) => (
                <XAxis {...x} key={key} data-testid={`ds-scatter-chart-x-axis-${index}`} />
            ))}

            {axis.yList.map(({key, ...y}, index) => (
                <YAxis {...y} key={key} data-testid={`ds-scatter-chart-y-axis-${index}`} />
            ))}

            {axis.zList.map(({ key,...z}, index) => (
                <ZAxis {...z} key={key} data-testid={`ds-scatter-chart-z-axis-${index}`} />
            ))}

            {currentTooltip && (
                <Tooltip {...currentTooltip}/>
            )}

            {withLegend && (
                <Legend />
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
                x: axis.x,
                y: axis.y,
                z: axis.z
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