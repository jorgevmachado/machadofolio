import React from 'react';

import type { AreaChartDataItem, AreaChartLinearGradient } from '../types';

type LinearGradientProps = AreaChartLinearGradient & {
    data: Array<AreaChartDataItem>;
};

export default function LinearGradient({
                                           id,
                                           x1 = '0',
                                           y1 = '0',
                                           x2 = '0',
                                           y2 = '0',
                                           data,
                                           value,
                                           stops,
                                       }: LinearGradientProps) {

    const gradientOffset = () => {
        const values = data.map((item) => {
            if(item?.[value]) {
                const itemValue = item[value];
                if(typeof itemValue === 'number') {
                    return itemValue;
                }
                const itemNumber = Number(itemValue);
                if(!isNaN(itemNumber)) {
                    return itemNumber;
                }
                return 0;
            }
            return 0;
        });

        const dataMax = Math.max(...values);

        const dataMin = Math.min(...values);

        if (dataMax <= 0) {
            return 0;
        }

        if (dataMin >= 0) {
            return 1;
        }

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    return (
        <defs>
            <linearGradient
                id={id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                data-testid="ds-area-chart-linear-gradient"
            >
                {stops.map((stop, index) => (
                    <stop
                        key={`${stop.key}-${index}`}
                        offset={stop?.offset || off}
                        stopColor={stop.stopColor}
                        stopOpacity={stop.stopOpacity}
                        data-testid={`ds-area-chart-linear-gradient-stop-${stop.key}`}
                    />
                ))}
            </linearGradient>
        </defs>
    )
}