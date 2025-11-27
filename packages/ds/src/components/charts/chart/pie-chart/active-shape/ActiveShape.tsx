import React from 'react';

import { Sector, SectorProps } from 'recharts';

import type { PieSectorData } from '../types';

type PieActiveShapeProps = React.SVGProps<SVGPathElement> & Partial<SectorProps> & PieSectorData;

export default function ActiveShape ({
                                         cx = 0,
                                         cy = 0,
                                         fill,
                                         value,
                                         payload,
                                         percent = 1,
                                         midAngle = 1,
                                         endAngle,
                                         startAngle,
                                         innerRadius,
                                         outerRadius = 0,
                                     }: PieActiveShapeProps) {

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * (midAngle));
    const cos = Math.cos(-RADIAN * (midAngle));
    const sx = (cx) + ((outerRadius) + 10) * cos;
    const sy = (cy) + ((outerRadius) + 10) * sin;
    const mx = (cx) + ((outerRadius) + 30) * cos;
    const my = (cy) + ((outerRadius) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} data-testid="ds-pie-chart-active-shape-text">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                fill={fill}
                endAngle={endAngle}
                startAngle={startAngle}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                data-testiid="ds-pie-chart-active-shape-sector-start"
            />
            <Sector
                cx={cx}
                cy={cy}
                fill={fill}
                endAngle={endAngle}
                startAngle={startAngle}
                innerRadius={(outerRadius) + 6}
                outerRadius={(outerRadius) + 10}
                data-testiid="ds-pie-chart-active-shape-sector-end"
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                fill="#333"
                textAnchor={textAnchor}
                data-testid="ds-pie-chart-active-shape-text-value"
            >
                {`PV ${value}`}
            </text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                fill="#999"
                textAnchor={textAnchor}
                data-testid="ds-pie-chart-active-shape-text-rate">
                {`(Rate ${((percent) * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
}