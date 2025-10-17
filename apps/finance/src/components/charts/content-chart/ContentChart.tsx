'use client';
import React from 'react';

import { Card, joinClass, Text } from '@repo/ds';

import './ContentChart.scss';

type ContentChartProps = {
    title: string;
    children: React.ReactNode;
    fallback?: string;
    subtitle?: string;
    className?: string;
    isFallback: boolean;
};

export default function ContentChart({
    title,
    children,
    fallback = 'No items registered',
    subtitle,
    className,
    isFallback
}: ContentChartProps) {
    return (
        <Card className={joinClass(['content-chart', className && className])}>
            <Text tag="h2" variant="large" color="primary-60" weight="bold">
                {title}
            </Text>
            {isFallback ? (
                <div className="content-chart__fallback">
                    <Text variant="medium" color="neutral-80" className="content-chart__subtitle">
                        {fallback}
                    </Text>
                </div>
            ): (
                <>
                    {subtitle && (
                        <Text variant="medium" color="neutral-80" className="content-chart__subtitle">
                            {subtitle}
                        </Text>
                    )}
                    {children}
                </>
            )}
        </Card>
    )
}