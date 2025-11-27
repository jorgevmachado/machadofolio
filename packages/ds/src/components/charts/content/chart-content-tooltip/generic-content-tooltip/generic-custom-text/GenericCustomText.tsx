import React, { useMemo } from 'react';

import { convertToNumber, getPercentValue } from '@repo/services';

import { Text } from '../../../../../../elements';

import type { GenericTextProps } from '../../../../types';

type GenericCustomTextProps = {
    total: number;
    payload: Record<string, string | number>;
    className?: string;
    genericProps: GenericTextProps;
    'data-testid'?: string;
}

export default function GenericCustomText({
                                              total,
                                              payload,
                                              className,
                                              genericProps,
                                              'data-testid': dataTestId,
                                          }: Readonly<GenericCustomTextProps>) {

    const color = !payload.color || typeof payload.color !== 'string' ? undefined : payload.color;

    const valueNumber = useMemo(() => {
        const value = payload?.value;
        if(typeof value === 'number') {
            return value;
        }
        if(typeof value === 'string') {
            return  convertToNumber(value);
        }
        return 0;
    }, [payload?.value]);

    const label = useMemo(() => {
        const { withName = true, withValue, withTotalPercent } = genericProps;
        const hasName = Boolean(withName && payload?.name);
        const hasValue = Boolean(withValue && payload?.value);
        const totalPercent = getPercentValue(valueNumber, total);
        const labelTotalPercent = withTotalPercent ? ` (${totalPercent})` : '' ;

        if(hasName && hasValue) {
            return `${payload.name}: ${payload.value} ${labelTotalPercent}`;
        }
        if(hasName && !hasValue) {
            return `${payload.name}`;
        }
        if(!hasName && hasValue) {
            return `${payload.value}`;
        }
        return '';
    }, [valueNumber, total, genericProps, payload.name, payload.value]);

    return (
        <li style={{ color: color }} className={className} data-testid={dataTestId}>
            <Text {...genericProps} style={{ color: color }}>
                {label}
            </Text>
        </li>
    )
}