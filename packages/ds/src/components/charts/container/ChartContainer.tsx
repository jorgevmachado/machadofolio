import React from 'react';

import { Text } from '../../../elements';
import { joinClass } from '../../../utils';
import Card from '../../card';

import type { TWrapper } from '../types';

import ChartFallback, { type ChartFallbackProps } from './fallback';

import './ChartContainer.scss';

type ChartContentProps = {
    title: string;
    children?: React.ReactNode;
    subtitle?: string;
    fallback?: ChartFallbackProps;
    className?: string;
    isFallback: boolean;
    wrapperType?: TWrapper;
}

export default function ChartContainer ({
                                            title,
                                            children,
                                            subtitle,
                                            fallback,
                                            className,
                                            isFallback,
                                            wrapperType = 'default',
                                        }: Readonly<ChartContentProps>) {

    const Wrapper = wrapperType === 'card' ? Card : 'div';
    const testId = wrapperType === 'card' ? 'ds-chart-container-card' : 'ds-chart-container-default';

    return (
        <Wrapper className={joinClass(['ds-chart-container', className ])} data-testid={testId}>
            <Text tag="h2" variant="large" color="primary-60" weight="bold" data-testid="ds-chart-container-title">
                {title}
            </Text>
            { isFallback ? (
                <ChartFallback {...fallback} text={fallback?.text ?? 'No data available'} data-testid="ds-chart-container-fallback"/>
            ) : (
                <>
                    {subtitle && (
                        <Text
                            color="neutral-80"
                            variant="medium"
                            className="ds-chart-container__subtitle"
                            data-testid="ds-chart-container-subtitle">
                            {subtitle}
                        </Text>
                    )}
                    {children}
                </>
            )}
        </Wrapper>
    )
}