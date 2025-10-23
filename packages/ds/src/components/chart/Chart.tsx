import React, { useMemo } from 'react';

import { Text } from '../../elements';
import { joinClass } from '../../utils';

import BarChart from './bar-chart';
import ChartWrapper from './chart-wrapper';
import ChartTooltip from './chart-tooltip';
import PieChart from './pie-chart';
import { mapColors } from './colors';

import { ChartTooltipProps, ColorProps, DataChartItem, TChartColor } from './types';

import './Chart.scss';

type WrapperProps = React.ComponentProps<typeof ChartWrapper>;
type BarChartProps = React.ComponentProps<typeof BarChart>;

type ChartProps = {
    top?: number;
    type: 'bar' | 'pie';
    data: Array<Omit<DataChartItem, 'color'>>;
    title: string;
    colors?: Array<ColorProps>;
    children?: React.ReactNode;
    fallback?: string;
    subtitle?: string;
    className?: string;
    colorType?: TChartColor;
    layoutType?: BarChartProps['type'];
    wrapperType?: WrapperProps['type'];
    chartTooltip?: ChartTooltipProps;
    tooltipContent?: (params: ChartTooltipProps) => React.ReactNode;
}

export default function Chart({
                                  top,
                                  type,
                                  data,
                                  title,
                                  colors,
                                  children,
                                  fallback,
                                  subtitle,
                                  className,
                                  colorType,
                                  layoutType,
                                  wrapperType,
    chartTooltip,
                                  tooltipContent,
                              }: ChartProps) {

    const list = useMemo(() => {
        const currentData = [...(data ?? [])];
        const sortedData = type === 'pie'
            ? currentData
            : currentData.sort((a, b) => b.value - a.value);
        const limitedData = typeof top === 'number'
            ? sortedData.slice(0, top)
            : sortedData;
        const mappedData = limitedData.map((item, index) => {
            const color = mapColors(item.name, index, colorType || item.type, colors);
            const result: DataChartItem = {
                ...item,
                fill: item.fill || color,
                color,
            }
            return result;
        })

        return mappedData.filter((item) => item !== undefined);

    }, [data, colors, colorType, top, type]);

    const isFallback = list.length <= 0;
    return (
        <ChartWrapper type={wrapperType} className={joinClass(['ds-chart', className && className ])}>
            <Text tag="h2" variant="large" color="primary-60" weight="bold" data-testid="ds-chart-title">
                {title}
            </Text>
            {
                isFallback ? (
                    <div className="ds-chart__fallback" data-testid="ds-chart-fallback">
                        <Text variant="medium" color="neutral-80" className="ds-chart__subtitle">
                            {fallback}
                        </Text>
                    </div>
                ) : (
                    <>
                        {subtitle && (
                            <Text variant="medium" color="neutral-80" className="ds-chart__subtitle" data-testid="ds-chart-subtitle">
                                {subtitle}
                            </Text>
                        )}

                        {type === 'bar' && (
                            <BarChart
                                type={layoutType}
                                data={list}
                                tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                            />
                        )}

                        {type === 'pie' && (
                            <PieChart
                                data={list}
                                tooltipContent={!chartTooltip? tooltipContent : (params) => (<ChartTooltip {...params} {...chartTooltip}/>)}
                            />
                        )}

                        {children}
                    </>
                )
            }
        </ChartWrapper>)
};
