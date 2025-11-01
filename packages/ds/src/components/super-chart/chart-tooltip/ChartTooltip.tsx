import React, { useMemo } from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '../../../elements';

import type { ChartTooltipParams, TextProps, TextTooltipProps } from '../types';

type ChartTooltipProps = ChartTooltipParams;


const defaultProps: TextProps = {
    color: 'neutral-100',
    weight: 'bold',
    variant: 'small',
}

type GenericTextTooltipProps =  {
    data: Record<string, string | number>;
    genericTextProps?: TextProps;
};
function GenericTextTooltip({ data, genericTextProps }: GenericTextTooltipProps) {
    const textProps = {...defaultProps, ...genericTextProps};
    const { withCurrencyFormatter, ...props } = textProps;

    const list = Object.entries(data).map(([key, value]) => ({
        name: key,
        value: !withCurrencyFormatter? value : currencyFormatter(value),
    }));

    return  list.map(({ name, value }, index) => (
        <Text {...props} key={`name-${index}`} data-testid={`ds-chart-tooltip-${name}-generic`}>
            {name}: {value}
        </Text>
    ))
}


function TextTooltip({ type, text, dataName, withCurrencyFormatter = false, ...props }: TextTooltipProps) {
    const textProps = {...defaultProps, ...props};
    const label = useMemo(() => {
        const currentLabel = withCurrencyFormatter ? currencyFormatter(dataName) : dataName;
        if(!text) {
            return currentLabel;
        }
        return `${text}: ${currentLabel}`;
    }, [dataName, withCurrencyFormatter, text]);

    return (
        <Text {...textProps} data-testid={`ds-chart-tooltip-${type}`}>
            {label}
        </Text>
    )
}

const defaultStyle: React.CSSProperties = {
    gap: '0.25rem',
    border: '1px solid #e5e7eb',
    display: 'flex',
    padding: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    borderRadius: '8px',
    flexDirection: 'column',
    backgroundColor: 'white'
}

export default function ChartTooltip({
    style,
    active,
    payload,
    nameProps,
    hourProps,
    valueProps,
    countProps,
    percentageProps,
    withGenericProps,
    genericTextProps,
}: Readonly<ChartTooltipProps>) {
    if(active && payload && payload?.length) {
        const currentPayload = payload[0];
        const data = currentPayload?.payload || {} as Record<string, string | number>;
        const value = Number(data?.value) || 0;
        const percentageTotal = Number(data?.percentageTotal) || 0;
        const percentage = !data.percentageTotal ? undefined : ((value / percentageTotal) * 100).toFixed(1);

        const currentStyle =  style ?? defaultStyle;

        return (
            <div style={currentStyle} data-testid="ds-chart-tooltip">

                {((nameProps?.show ?? true) && data.name) && (
                    <TextTooltip
                        {...nameProps}
                        type="name"
                        dataName={data.name}
                    />
                )}

                {((hourProps?.show ?? true) && data?.hour) && (
                    <TextTooltip
                        {...hourProps}
                        type="hour"
                        text={hourProps?.text}
                        dataName={data.hour}
                        withCurrencyFormatter={hourProps?.withCurrencyFormatter}
                    />
                )}

                {((valueProps?.show ?? true) && data?.value) && (
                    <TextTooltip
                        {...countProps}
                        type="value"
                        text={countProps?.text ?? 'Value'}
                        dataName={data.value}
                        withCurrencyFormatter={valueProps?.withCurrencyFormatter ?? true}
                    />
                )}

                {((countProps?.show ?? true) && data?.count) && (
                    <TextTooltip
                        {...countProps}
                        type="count"
                        text={countProps?.text ?? 'Count'}
                        dataName={data.count}
                    />
                )}

                {((percentageProps?.show ?? true) && percentage) && (
                    <TextTooltip
                        {...percentageProps}
                        type="percentage"
                        text={countProps?.text ?? 'Percentage'}
                        dataName={`${percentage}%`}
                    />
                )}
                {withGenericProps && (
                    <GenericTextTooltip data={data} genericTextProps={genericTextProps}/>
                )}
            </div>
        )
    }
    return null;
}