import React, { useMemo } from 'react';

import { DefaultTooltipContent } from 'recharts';

import { convertToNumber } from '@repo/services';

import { GenericTextProps, type TextProps, TooltipProps } from '../../types';

import { compareFilter } from '../filters';

import type { TooltipContentProps } from './types';

import TextTooltip from './text-tooltip';
import GenericContentTooltip from './generic-content-tooltip';

import './ChartContentTooltip.scss';

type ChartContentTooltipProps = {
    params: TooltipContentProps;
    tooltip: Omit<TooltipProps, 'show'>;
}

const defaultProps: TextProps = {
    color: 'neutral-100',
    weight: 'bold',
    variant: 'regular',
}

function omitShow<T extends object>(props: T | undefined): Omit<T, 'show'> | undefined {
    if (!props) return props;
    const result = { ...props };
    if ('show' in result) {
        delete (result as Partial<T> & { show?: unknown }).show;
    }
    return result;
}

export default function ChartContentTooltip({
                                                params,
                                                tooltip
                                            }: ChartContentTooltipProps) {

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

    const tooltipConfigs = [
        {
            shouldRender: labelProps && params?.label && labelProps?.show !== false,
            props: omitShow(labelProps),
            extra: {
                type: 'label',
                color: 'neutral-100' as const,
                style: { margin: 0 },
                dataName: params.label as string | number,
                appendText: withTotalPercent ? ` (Total: ${total})` : undefined,
            },
        },
        {
            shouldRender: (nameProps?.show ?? true) && data?.name,
            props: omitShow(nameProps),
            extra: {
                type: 'name',
                style: { margin: 0 },
                dataName: data.name as string | number,
            },
        },
        {
            shouldRender: (hourProps?.show ?? true) && data?.hour,
            props: omitShow(hourProps),
            extra: {
                type: 'hour',
                style: { margin: 0 },
                text: hourProps?.text,
                dataName: data.hour as string | number,
            },
        },
        {
            shouldRender: (valueProps?.show ?? true) && data?.value,
            props: omitShow(valueProps),
            extra: {
                type: 'value',
                style: { margin: 0 },
                text: valueProps?.text ?? 'Value',
                dataName: data.value as string | number,
                withCurrencyFormatter: valueProps?.withCurrencyFormatter ?? true,
            },
        },
        {
            shouldRender: (countProps?.show ?? true) && data?.count,
            props: omitShow(countProps),
            extra: {
                type: 'count',
                style: { margin: 0 },
                text: countProps?.text ?? 'Count',
                dataName: data.count as string | number,
            },
        },
        {
            shouldRender: (percentageProps?.show ?? true) && percentage,
            props: omitShow(percentageProps),
            extra: {
                type: 'percentage',
                style: { margin: 0 },
                text: countProps?.text ?? 'Percentage',
                dataName: `${percentage}%`,
            },
        },
    ];

    return (
        <div
            className="ds-chart-content-tooltip"
            style={tooltip?.style}
            data-testid="ds-chart-content-tooltip">
            {tooltipConfigs.map((cfg) =>
                cfg.shouldRender ? (
                    <TextTooltip
                        key={`${cfg.extra.type}-${String(cfg.extra.dataName)}`}
                        {...defaultProps}
                        {...cfg.props}
                        {...cfg.extra}
                        className="ds-chart-content-tooltip__text"
                    />
                ) : null
            )}
            {(showGeneric && genericTextProps ) && (
                <GenericContentTooltip
                    data={data}
                    total={total}
                    payload={[...currentPayload]}
                    genericProps={omitShow(genericTextProps) as GenericTextProps} />
            )}
        </div>
    )
}