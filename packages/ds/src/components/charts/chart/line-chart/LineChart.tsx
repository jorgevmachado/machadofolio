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

import { getRandomHarmonicPalette, mapListColors } from '../../colors';

import { LineChartLabelsItem, LineChartProps } from './types';

import { buildDomain, type CustomDomainItem, INITIAL_STATE, updateDomainItem } from './domain';

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
                                      axis,
                                      data,
                                      style,
                                      margin,
                                      labels,
                                      legend,
                                      tooltip,
                                      layout = 'horizontal',
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

    const list = useMemo(() => {
        return mapListColors<LineChartLabelsItem>(labels ?? []);
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
                        return (<ReferenceLine key={index} {...referenceLine}
                                               data-testid={`ds-line-chart-reference-line-${index}`}/>)
                    }
                })}

                {(axis && axis?.xList && axis?.xList?.length > 0) && axis.xList.map((item) => (
                    <XAxis
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


                {(axis && axis?.yList && axis?.yList && axis?.yList?.length > 0) && axis.yList.map((item) => (
                    <YAxis
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