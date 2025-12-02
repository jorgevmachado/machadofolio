import React from 'react';

import { currencyFormatter } from '@repo/services';

import { Text } from '../../../../../elements';
import { type GenericTextProps } from '../../../types';

import GenericCustomText from './generic-custom-text';

import './GenericContentTooltip.scss';

type GenericContentPayload =  Record<string, string | number> & {
    payload: Record<string, string | number>;
}

type GenericContentTooltipProps = {
    data: Record<string, string | number>;
    total?: number;
    payload: Array<GenericContentPayload>;
    genericProps: GenericTextProps;
}

export default function GenericContentTooltip({
                                                  total = 0,
                                                  data,
                                                  payload,
                                                  genericProps,
                                              }: GenericContentTooltipProps) {
    const hasGenericName = genericProps?.withName !== false;
    const hasGenericValue = genericProps?.withValue !== false;

    if(hasGenericName || hasGenericValue) {
        const genericCurrentPayload = (payload: GenericContentPayload) => {
            if(genericProps?.withSubLevel) {
                return payload.payload;
            }
            return payload;
        }

        return (
            <ul className="ds-generic-content-tooltip" data-testid="ds-generic-content-tooltip-custom">
                {payload?.map((item, index) => (
                    <GenericCustomText
                        key={`generic-custom-text-${index}`}
                        total={total}
                        payload={genericCurrentPayload(item as GenericContentPayload)}
                        className="ds-generic-content-tooltip__custom"
                        data-testid={`ds-generic-content-tooltip-custom-item-${index}`}
                        genericProps={genericProps}
                    />
                ))}
            </ul>
        );
    }

    const list = Object.entries(data).map(([key, value], index) => {
        return {
            key: `${key}-${index}`,
            name: key,
            value: genericProps?.withCurrencyFormatter ? currencyFormatter(value) : value,
        }
    });

    return  list.map(({ key, name, value }, index) => (
        <Text {...genericProps} key={key} data-testid={`ds-generic-content-tooltip-default-item-${index}`}>
            {name}: {value}
        </Text>
    ))

}