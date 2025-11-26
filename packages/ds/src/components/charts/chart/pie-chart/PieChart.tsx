import React, { useMemo } from 'react';

import {
    PieChart as PieChartComponent,
    Pie,
    Legend,
    Tooltip,
    Cell,
} from 'recharts';


import { PieChartDataItem, PieChartProps, PieProps } from './types';

import ActiveShape from './active-shape';

import { mapListColors } from '../../colors';

import CustomizeLabel from './customize-label';
import PieNeedle from './pie-needle';

import './PieChart.scss';

const defaultStyle = {
    width: '100%',
    height: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    aspectRatio: 1,
}

export default function PieChart({
    data,
    style,
    margin,
    legend,
    tooltip,
    responsive = true,
    withNeedle,
    withDefaultCustomLabel = false,
    withDefaultActiveShape = false
}: PieChartProps) {
    const currentStyle = useMemo(() => {
        if(withDefaultActiveShape && !style?.maxWidth) {
            return { ...defaultStyle, ...style, maxWidth: '750px' }
        }
        return { ...defaultStyle, ...style }
    }, [style, withDefaultActiveShape]) ;

    const list = useMemo(() => {
        const dataColorMap = mapListColors<PieProps>(data);
        if(withDefaultActiveShape || withDefaultCustomLabel || withNeedle) {
            return dataColorMap.slice(0,1);
        }
        return dataColorMap;
    }, [data, withDefaultActiveShape, withDefaultCustomLabel, withNeedle]);


    const hasCustomLabel = (label?: PieProps['label']) => {
        if(!label) {
            return false;
        }

        return typeof label !== 'boolean';
    }

    const pieData = (list: Array<PieChartDataItem>) => {
        return mapListColors<PieChartDataItem>(list);
    };


    return (
        <div data-testid="ds-pie-chart" className="ds-pie-chart">
            <PieChartComponent
                style={currentStyle}
                margin={margin}
                responsive={responsive}
            >
                {list.map(({key, ...pie}, index) => (
                    <Pie
                        key={`${key}-${index}`}
                        cx={pie?.cx}
                        cy={pie?.cy}
                        fill={pie?.fill}
                        data={pie.data}
                        label={withDefaultCustomLabel ? CustomizeLabel : pie?.label}
                        dataKey={pie?.dataKey}
                        labelLine={pie?.labelLine}
                        activeShape={withDefaultActiveShape ? ActiveShape : pie?.activeShape}
                        endAngle={pie?.endAngle}
                        startAngle={pie?.startAngle}
                        innerRadius={pie?.innerRadius}
                        outerRadius={pie?.outerRadius}
                        cornerRadius={pie?.cornerRadius}
                        paddingAngle={pie?.paddingAngle}
                        isAnimationActive={pie?.isAnimationActive}
                        data-testid={`ds-pie-chart-pie-${key}`}
                    >
                        {(withDefaultCustomLabel || hasCustomLabel(pie?.label)) && pieData(pie?.data).map((item, index) => (
                                <Cell
                                    {...item}
                                    key={`cell-${item.name}`}
                                    data-testid={`ds-pie-chart-cell-${index}`}
                                />
                            )
                        )}
                        {withNeedle && (
                            <PieNeedle
                                cx={pie?.cx}
                                cy={pie?.cy}
                                iR={pie?.innerRadius}
                                oR={pie?.outerRadius}
                                color={pie?.color}
                                value={pie?.value}
                                data={pie.data}
                            />
                        )}
                    </Pie>
                ))}
                {tooltip && (
                    <Tooltip {...tooltip}/>
                )}

                {legend && (
                    <Legend {...legend}/>
                )}
            </PieChartComponent>
        </div>
    )
}