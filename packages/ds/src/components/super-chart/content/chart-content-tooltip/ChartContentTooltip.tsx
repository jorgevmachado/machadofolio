import React, { useMemo } from 'react';

import { DefaultTooltipContent } from 'recharts';

import { convertToNumber } from '@repo/services';

import { type TextProps, TooltipProps } from '../../types';

import { compareFilter } from '../utils';

import type { TooltipContentProps } from './types';

import TextTooltip from './text-tooltip';
import GenericContentTooltip from './generic-content-tooltip';

import './ChartContentTooltip.scss';

type ChartContentTooltipProps = {
    params: TooltipContentProps;
    tooltip: TooltipProps
}

const defaultProps: TextProps = {
    color: 'neutral-100',
    weight: 'bold',
    variant: 'regular',
}

export default function ChartContentTooltip({
    params,
    tooltip
}: Readonly<ChartContentTooltipProps>) {

    const currentPayload = useMemo(() => {
        const payload = params?.payload || [];
        if (tooltip?.filterContent && tooltip?.filterContent.length > 0) {
            const { filterContent } = tooltip;
            return payload.filter((item) => filterContent.every(({ by = 'value', label, value, condition }) => compareFilter({
                by,
                label,
                param: item?.[label],
                value,
                condition
            })));
        }
        return payload;
    }, [params.payload, tooltip]);

    if(!params?.active) {
        return null;
    }

    if(!params?.payload) {
        return null;
    }

    if( params?.payload?.length <= 0) {
        return null;
    }

    if(tooltip?.withDefaultTooltip) {
        return <DefaultTooltipContent {...params} payload={currentPayload} data-testid="ds-chart-content-tooltip-default" />;
    }

    const firstItem = currentPayload[0];

    const data = (tooltip.withSubLevel ? firstItem?.payload?.payload : firstItem?.payload )|| {} as Record<string, string | number>;

    const total = currentPayload.reduce((result, entry) => result + (entry.value as number), 0);

    const value = convertToNumber(data?.value);
    const percentageTotal = convertToNumber(data?.percentageTotal);
    const percentage = data.percentageTotal ? ((value / percentageTotal) * 100).toFixed(1) : undefined;

    const { labelProps, nameProps, hourProps, countProps, valueProps, genericTextProps, withTotalPercent, percentageProps } = tooltip;

    const showGeneric = Boolean(genericTextProps?.show);

    return (
        <div
            className="ds-chart-content-tooltip"
            style={tooltip?.style}
            data-testid="ds-chart-content-tooltip">
            {(labelProps && params?.label && labelProps?.show !== false) && (
                <TextTooltip
                    {...defaultProps}
                    {...labelProps}
                    type="label"
                    color="neutral-100"
                    style={{margin: 0}}
                    dataName={params.label}
                    appendText={withTotalPercent ? ` (Total: ${total})` : undefined}
                    className="ds-chart-content-tooltip__text"
                />
            )}
            {((nameProps?.show ?? true) && data?.name) && (
                <TextTooltip
                    {...defaultProps}
                    {...nameProps}
                    type="name"
                    style={{margin: 0}}
                    dataName={data.name}
                    className="ds-chart-content-tooltip__text"
                />
            )}

            {((hourProps?.show ?? true) && data?.hour) && (
                <TextTooltip
                    {...defaultProps}
                    {...hourProps}
                    type="hour"
                    text={hourProps?.text}
                    dataName={data.hour}
                    className="ds-chart-content-tooltip__text"
                />
            )}

            {((valueProps?.show ?? true) && data?.value) && (
                <TextTooltip
                    {...defaultProps}
                    {...valueProps}
                    type="value"
                    text={valueProps?.text ?? 'Value'}
                    dataName={data.value}
                    className="ds-chart-content-tooltip__text"
                    withCurrencyFormatter={valueProps?.withCurrencyFormatter ?? true}
                />
            )}

            {((countProps?.show ?? true) && data?.count) && (
                <TextTooltip
                    {...countProps}
                    type="count"
                    text={countProps?.text ?? 'Count'}
                    dataName={data.count}
                    className="ds-chart-content-tooltip__text"
                />
            )}

            {((percentageProps?.show ?? true) && percentage) && (
                <TextTooltip
                    {...percentageProps}
                    type="percentage"
                    text={countProps?.text ?? 'Percentage'}
                    dataName={`${percentage}%`}
                    className="ds-chart-content-tooltip__text"
                />
            )}

            {(showGeneric && genericTextProps ) && (
                <GenericContentTooltip
                    data={data}
                    total={total}
                    payload={currentPayload}
                    genericProps={genericTextProps} />
            )}
        </div>
    )
}