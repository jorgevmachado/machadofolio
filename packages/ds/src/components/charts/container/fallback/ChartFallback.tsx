import React from 'react';

import { Text } from '../../../../elements';
import { joinClass } from '../../../../utils';
import Button from '../../../button';

import type { ChartFallbackProps } from './types';

import './ChartFallback.scss';

export default function ChartFallback({
                                          text,
                                          action,
                                          className,
                                          'data-testid': dataTestId = 'ds-chart-fallback',
                                          ...props
                                      }: ChartFallbackProps) {

    const classNameList = joinClass([
        'ds-chart-fallback',
        className,
    ])

    return (
        <div
            {...props}
            className={classNameList}
            data-testid={dataTestId}
        >
            <Text
                color="neutral-80"
                variant="medium"
                className="ds-chart-fallback__subtitle"
                data-testid={`${dataTestId}-text`}>
                {text}
            </Text>
            {action && (
                <Button{...action} id="ds-chart-fallback-action" data-testid={`${dataTestId}-action`}/>
            )}
        </div>
    );
}