import React from 'react';

import { joinClass } from '../../../utils';

import { Text } from '../../../elements';

import ChartWrapper from '../chart-wrapper';

import type { TWrapper } from '../types';

import './ChartContent.scss';

type ChartContentProps = {
    title: string;
    children?: React.ReactNode;
    subtitle?: string;
    fallback?: string;
    className?: string;
    isFallback: boolean;
    wrapperType?: TWrapper;
}

export default function ChartContent ({
    title,
    children,
    subtitle,
    fallback,
    className,
    isFallback,
    wrapperType,
}: ChartContentProps) {

    return (
        <ChartWrapper type={wrapperType} className={joinClass(['ds-chart-content', className && className ])}>
            <Text tag="h2" variant="large" color="primary-60" weight="bold" data-testid="ds-chart-content-title">
                {title}
            </Text>
            { isFallback ? (
                    <div className="ds-chart-content__fallback" data-testid="ds-chart-content-fallback">
                        <Text
                            color="neutral-80"
                            variant="medium"
                            className="ds-chart-content__subtitle"
                            data-testid="ds-chart-content-fallback-text">
                            {fallback}
                        </Text>
                    </div>

            ) : (
                <>
                    {subtitle && (
                        <Text variant="medium" color="neutral-80" className="ds-chart-content__subtitle" data-testid="ds-chart-content-subtitle">
                            {subtitle}
                        </Text>
                    )}
                    {children}
                </>
            )}
        </ChartWrapper>
    )
}