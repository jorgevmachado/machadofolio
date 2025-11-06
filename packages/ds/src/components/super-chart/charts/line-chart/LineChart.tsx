import React, { useCallback, useMemo, useState } from 'react';

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart as LineChartComponent,
    MouseHandlerDataParam,
    ReferenceArea,
    ReferenceLine,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import { joinClass } from '../../../../utils';

import Button from '../../../button';

import { getRandomHarmonicPalette } from '../../colors';

import { CustomXAxisProps, CustomYAxisProps, LineChartProps } from './types';

import { buildDomain, INITIAL_STATE, updateDomainItem, type CustomDomainItem } from './domain';

import CustomizedDot from './customized-dot';
import CustomizedLabel from './customized-label';
import CustomizedAxisTick from './customized-axis-tick';

import './LineChart.scss';

const defaultStyle = {
    width: '100%',
    height: '100%',
    maxWidth: '700px',
    maxHeight: '70vh',
    aspectRatio: 1.618
}

const defaultMargin = {
    top: 5,
    left: 0,
    right: 0,
    bottom: 5,
}


export default function LineChart({
                                      data,
                                      style,
                                      margin,
                                      labels,
                                      legend,
                                      xAxis,
                                      yAxis,
                                      tooltip,
                                      layout = 'horizontal',
                                      withAxis = true,
                                      withZoom = false,
                                      onMouseUp,
                                      responsive = true,
                                      onMouseDown,
                                      onMouseMove,
                                      referenceArea,
                                      buttonZoomOut,
                                      referenceLines
                                  }: Readonly<LineChartProps>) {

    const [zoomGraph, setZoomGraph] = useState<CustomDomainItem>(INITIAL_STATE);

    const handleOnMouseUp = useCallback((e: MouseHandlerDataParam) => {
        if (onMouseUp) {
            onMouseUp(e);
        }
        if (withZoom) {
            setZoomGraph((prev: CustomDomainItem): CustomDomainItem => updateDomainItem({ prev, data, labels }));
        }

    }, [setZoomGraph, onMouseUp, withZoom, data, labels]);

    const zoomOut = useCallback(() => {
        setZoomGraph(INITIAL_STATE);
    }, [setZoomGraph]);

    const handleOnMouseDown = useCallback(
        (e: MouseHandlerDataParam) => {
            if (onMouseDown) {
                onMouseDown(e)
            }

            if (withZoom) {
                setZoomGraph((prev: CustomDomainItem): CustomDomainItem => ({ ...prev, refAreaLeft: e.activeLabel }));
            }

        },
        [setZoomGraph, onMouseDown, withZoom],
    );

    const handleOnMouseMove = useCallback(
        (e: MouseHandlerDataParam) => {
            if (onMouseMove) {
                onMouseMove(e)
            }
            if (withZoom) {
                setZoomGraph(prev => prev.refAreaLeft
                    ? { ...prev, refAreaRight: e.activeLabel }
                    : prev
                );
            }

        },
        [setZoomGraph, onMouseMove, withZoom],
    );

    const { refAreaLeft, refAreaRight } = zoomGraph;

    const currentStyle = { ...defaultStyle, ...style };

    const currentMargin = { ...defaultMargin, ...margin };

    const showXAxis = useMemo(() => {
        if (typeof withAxis === 'boolean') {
            return withAxis;
        }
        return withAxis?.x;
    }, [withAxis]);

    const showYAxis = useMemo(() => {
        if (typeof withAxis === 'boolean') {
            return withAxis;
        }
        return withAxis?.y;
    }, [withAxis]);

    const axis = useMemo(() => {
        const x: CustomXAxisProps = { dataKey: 'name' };
        const y: CustomYAxisProps = { width: 'auto' };

        const xList: Array<CustomXAxisProps> = !xAxis ? [x] : xAxis;
        const yList: Array<CustomYAxisProps> = !yAxis ? [y] : yAxis;

        return { xList, yList }
    }, [xAxis, yAxis]);

    const list = useMemo(() => {
        return labels?.map((label) => {
            const { stroke } = getRandomHarmonicPalette();
            return {
                ...label,
                stroke: label?.stroke || stroke,
            }
        });

    }, [labels]);

    const listReferenceLine = useMemo(() => {
        const currentReferenceLines = [...(referenceLines ?? [])];
        return currentReferenceLines.map((line) => {
            const { stroke } = getRandomHarmonicPalette();
            return {
                ...line,
                stroke: line?.stroke || stroke,
            }
        })
    }, [referenceLines]);

    return (
        <div style={!withZoom ? undefined : { width: '100%', userSelect: 'none' }} data-testid="ds-line-chart">

            {(withZoom && buttonZoomOut) && (
                <Button
                    {...buttonZoomOut}
                    onClick={zoomOut}
                    className={joinClass(['ds-line-chart__zoom-out', buttonZoomOut?.className && buttonZoomOut.className])}
                    data-testid="ds-line-chart-button-zoom-out"
                />
            )}

            <LineChartComponent
                data={data}
                layout={layout}
                style={currentStyle}
                margin={currentMargin}
                onMouseUp={handleOnMouseUp}
                responsive={responsive}
                onMouseDown={handleOnMouseDown}
                onMouseMove={handleOnMouseMove}
            >
                <CartesianGrid strokeDasharray="3 3"/>

                {listReferenceLine?.length > 0 && listReferenceLine.map(({ show, ...referenceLine }, index) => {
                    if (show) {
                        return (<ReferenceLine key={index} {...referenceLine} data-testid={`ds-line-chart-reference-line-${index}`} />)
                    }
                })}

                {showXAxis && axis.xList.map((item, index) => (
                    <XAxis
                        key={index}
                        {...item}
                        tick={!item?.customAxisTick ? item?.tick : ({ x, y, payload }) => CustomizedAxisTick({
                            x,
                            y,
                            payload,
                            customAxisTick: item?.customAxisTick
                        })}
                        domain={!item?.customDomain ? item?.domain : buildDomain(item.customDomain, zoomGraph)}
                    />
                ))}


                {showYAxis && axis.yList.map((item, index) => (
                    <YAxis
                        key={index}
                        {...item}
                        tick={!item?.customAxisTick ? item?.tick : ({ x, y, payload }) => CustomizedAxisTick({
                            x,
                            y,
                            payload,
                            customAxisTick: item?.customAxisTick
                        })}
                        domain={!item?.customDomain ? item?.domain : buildDomain(item.customDomain, zoomGraph)}
                    />
                ))}

                {tooltip && (
                    <Tooltip {...tooltip}/>
                )}

                {legend && (
                    <Legend {...legend}/>
                )}

                {list?.map(((item, index) => (
                    <Line
                        key={item?.name}
                        dot={!item?.customDot ? item?.dot : ({ cx, cy, value }) => CustomizedDot({
                            cx,
                            cy,
                            value,
                            customDot: item?.customDot
                        })}
                        type={item.type}
                        fill={item?.fill}
                        data={item?.data}
                        name={item?.name}
                        label={!item?.customLabel ? item?.label : ({ x, y, value, stroke }) => CustomizedLabel({
                            x,
                            y,
                            value,
                            stroke,
                            customLabel: item?.customLabel
                        })}
                        stroke={item.stroke}
                        dataKey={item?.dataKey}
                        yAxisId={item?.yAxisId}
                        activeDot={item?.activeDot}
                        tooltipType={item?.tooltipType}
                        strokeWidth={item?.strokeWidth}
                        strokeDasharray={item?.strokeDasharray}
                        animationDuration={item?.animationDuration}
                        data-testid={`ds-line-chart-line-${index}`}
                    />
                )))}

                {(withZoom && refAreaLeft && refAreaRight) ? (
                    <ReferenceArea
                        x1={refAreaLeft}
                        x2={refAreaRight}
                        yAxisId={referenceArea?.yAxisId || '1'}
                        strokeOpacity={referenceArea?.strokeOpacity || 0.3}/>
                ) : null}

            </LineChartComponent>
        </div>
    )
}