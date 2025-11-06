import React from 'react';

import { joinClass } from '../../../utils';

import { Text } from '../../../elements';

import Card from '../../card';

import type { TWrapper } from '../types';

import './ChartContainer.scss';

type ChartContentProps = {
    title: string;
    children?: React.ReactNode;
    subtitle?: string;
    fallback?: string;
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
                    <div className="ds-chart-container__fallback" data-testid="ds-chart-container-fallback">
                        <Text
                            color="neutral-80"
                            variant="medium"
                            className="ds-chart-container__subtitle"
                            data-testid="ds-chart-container-fallback-text">
                            {fallback}
                        </Text>
                    </div>

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