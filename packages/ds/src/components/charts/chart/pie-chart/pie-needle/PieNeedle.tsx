import React, { useMemo } from 'react';

import { convertToNumber } from '@repo/services';

import type { PieChartDataItem } from '../types';

const RADIAN = Math.PI / 180;

type PieNeedleProps = {
    cx?: number | string;
    cy?: number | string;
    iR?: number | string;
    oR?: number | string | ((dataPoint: any) => number | string);
    data: Array<PieChartDataItem>;
    value?: number;
    color?: string;
};

export default function PieNeedle(props: PieNeedleProps) {

    const values = useMemo(() => {
        const {
            cx,
            cy,
            iR,
            oR,
            data,
            color,
            value,
        } = props;
        const needle = {
            cx: convertToNumber(cx),
            cy: convertToNumber(cy),
            iR: convertToNumber(iR),
            oR: convertToNumber(oR),
            value: convertToNumber(value),
        }
        const total = data.reduce((sum, entry) => sum + entry.value, 0);
        const ang = 180.0 * (1 - needle.value / total);
        const length = (needle.iR + 2 * needle.oR) / 3;
        const sin = Math.sin(-RADIAN * ang);
        const cos = Math.cos(-RADIAN * ang);
        const r = 5;
        const x0 = needle.cx + 5;
        const y0 = needle.cy + 5;
        const xba = x0 + r * sin;
        const yba = y0 - r * cos;
        const xbb = x0 - r * sin;
        const ybb = y0 + r * cos;
        const xp = x0 + length * cos;
        const yp = y0 + length * sin;
        return {
            r,
            d: `M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`,
            cx: x0,
            cy: y0,
            fill: color,
        }
    }, [props]);

    const { r, d, cx, cy, fill } = values;

    return [
        <circle key="needle-circle" cx={cx} cy={cy} r={r} fill={fill} stroke="none" data-testid="ds-pie-chart-needle-circle" />,
        <path
            key="needle-path"
            d={d}
            stroke="#none"
            fill={fill}
            data-testid="ds-pie-chart-needle-path"
        />,
    ];
}