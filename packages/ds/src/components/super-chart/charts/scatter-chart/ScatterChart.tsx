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

import type { ScatterChartProps } from './type';
import { XAxisProps, YAxisProps, ZAxisProps, TooltipProps } from '../../types';
import BubbleScatterChart from './bubble-scatter-chart';
import { getRandomHarmonicPalette } from '../../colors';

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
    withTooltip = true,
    tooltipContent,
}: ScatterChartProps) {

    const currentStyle = { ...defaultStyle, ...style };

    const currentMargin = { ...defaultMargin, ...margin };

    const axis = useMemo(() => {
        const xDefault: XAxisProps = { unit: 'cm', type: 'number', name: 'stature', dataKey: 'x' };
        const yDefault: YAxisProps = { unit: 'kg', type: 'number', name: 'weight',  dataKey: 'y', width: 'auto' };
        const zDefault: ZAxisProps = { type: 'number', range: [100, 100] };

        const xList: Array<XAxisProps> = xAxis ?? [xDefault];
        const yList: Array<YAxisProps> = yAxis ?? [yDefault];
        const zList: Array<ZAxisProps> = zAxis ?? [zDefault];

        const x: XAxisProps = xList[0] ?? xDefault;
        const y = yList[0] ?? yDefault;
        const z = zList[0] ?? zDefault;

        return { xList, yList, zList, x, y, z }
    }, [xAxis, yAxis, zAxis]);

    const currentTooltip = useMemo(() => {
        console.log('# => currentTooltip => tooltip => ', tooltip);
        const defaultTooltip: TooltipProps = {
            cursor: {
                strokeDasharray: '3 3'
            },
            content: tooltipContent
        }
        if(!tooltip) {
            return defaultTooltip;
        }
        const { withContent = true, ...props } = tooltip;
        defaultTooltip.content = withContent ? tooltipContent : undefined;
        return {...defaultTooltip, ...props};

    }, [tooltip]);

    const cellList = (data: ScatterProps['data'], withCell?: boolean) => {
        if(withCell && Array.isArray(data)) {
            return data.map((item, index) => {
                const { fill } = getRandomHarmonicPalette();
                return {
                    ...item,
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

            {axis.xList.map((x, index) => (
                <XAxis {...x} key={index} />
            ))}

            {axis.yList.map((y, index) => (
                <YAxis {...y} key={index} />
            ))}

            {axis.zList.map((z, index) => (
                <ZAxis {...z} key={index} />
            ))}

            {withTooltip && (
                <Tooltip {...currentTooltip}/>
            )}

            {withLegend && (
                <Legend />
            )}

            {data.map((item, index) => (
                <Scatter key={`${item.key}-${index}`} {...item}>
                    {item?.labelList && (
                        <LabelList {...item.labelList}/>
                    )}
                    {cellList(item?.data, item?.withCell).map((cell, index) => (
                        <Cell key={`cell-${index}`} fill={cell.fill} />
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
            data={data}
            style={currentStyle}
            margin={currentMargin}
            tooltip={currentTooltip}
            responsive={responsive}
        />
    )
}