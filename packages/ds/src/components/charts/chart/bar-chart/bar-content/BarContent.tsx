import React, { useMemo } from 'react';
import { Bar, Cell, LabelList } from 'recharts';

import { currencyFormatter } from '@repo/services';

import type { ActiveBar, BarChartLabelsItem, BarChartDataItem } from '../types';

import { getRandomHarmonicPalette } from '../../../colors';

import ActiveRectangle from './active-ractangle';
import LabelListContent from './label-list-content';

type BarContentProps = {
    data?: Array<BarChartDataItem>;
    labels?: Array<BarChartLabelsItem>;
    isVertical: boolean;
}

type CellItem = {
    key: string;
    fill: string;
    index: number;
    stroke: string;
}

type ListItem = {
    key: string;
    fill: string;
    cells: Array<CellItem>
    index: number;
    radius: [number, number, number, number];
    stroke: string;
    dataKey: string;
    stackId?: string;
    fillText?: string;
    labelList?: BarChartLabelsItem['labelList'];
    activeBar?: ActiveBar;
    background?: { fill: string };
    minPointSize?: number;
}

export default function BarContent({ data = [], labels = [], isVertical }: BarContentProps) {
    const mapperLabelList = (labelList: BarChartLabelsItem['labelList']) => {
        if(!labelList) {
            return labelList;
        }


        if(labelList?.withCustomContent) {
            labelList.content = (props) =>  LabelListContent({...props, fillText: labelList?.fill });
        }

        if(labelList?.withCurrencyFormatter && !labelList?.formatter) {
            labelList.formatter = (value) => {
                if (typeof value === 'number') {
                    return currencyFormatter(value);
                }
                return value;
            }
        }

        return labelList;
    }

    const list = useMemo(() => {

        const barData: Array<ListItem> = labels.map((label, index) => ({
            key: `${label.key}-${index}`,
            fill: label?.fill || '#808080',
            index,
            cells: [],
            radius: label?.radius ?? [0,0,0,0],
            stroke: label?.stroke || '#0072bb',
            dataKey: label.key,
            stackId: label?.stackId,
            activeBar: label?.activeBar,
            labelList: mapperLabelList(label?.labelList),
            background: label?.background,
            minPointSize: label?.minPointSize,
        }));

        const cellData: Array<CellItem> = data.map((item, index) => {
            const { fill, stroke } = getRandomHarmonicPalette();
            return {
                key: `${item.type}-${index}`,
                fill: item?.fill || fill,
                index,
                stroke: item?.stroke || item?.fill || stroke,
            }
        });

        const onlyOneBarData = barData.length === 1;

        if(onlyOneBarData && isVertical) {
            return barData.map((bar) => ({
                ...bar,
                cells: cellData
            }));
        }

        const orderedBarData: Array<ListItem> = [...barData].sort((a, b) => b.index - a.index);

        if(!isVertical) {
            const horizontalMappedList: Array<ListItem> = orderedBarData.map((bar) => ({
                ...bar,
                radius: [0, 8, 8, 0],
            }));

            return horizontalMappedList;
        }

        const mappedList: Array<ListItem> = orderedBarData.map((bar) => {
            return {
                ...bar,
                cells: cellData.map((cell) => ({
                    ...cell,
                    fill: bar.fill,
                    index: bar.index,
                    stroke: bar.stroke
                })),
            }
        });

        return mappedList;

    }, [labels, data, isVertical]);

    if(labels?.length <= 0) {
        return null;
    }

    return list.map((item) => {
        return (
            <Bar
                key={item.key}
                fill={item.fill}
                radius={item.radius}
                dataKey={item.dataKey}
                stackId={item?.stackId}
                activeBar={item?.activeBar ? <ActiveRectangle activeBar={item.activeBar}/> : undefined}
                background={item?.background}
                minPointSize={item?.minPointSize}
                data-testid={`ds-bar-content-${item.dataKey}-${isVertical ? 'vertical' : 'horizontal'}`}
            >
                {item?.labelList && (
                    <LabelList{...item.labelList }/>
                )}

                {item.cells.map((cell) => (
                    <Cell key={cell.key} fill={cell.fill} stroke={cell.stroke} />
                ))}
            </Bar>
        )
    })
}