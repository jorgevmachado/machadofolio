import React from 'react';

import Card from '../../card';

import type { TWrapper } from '../types';

interface ChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: TWrapper;
    children: React.ReactNode;
}

export default function ChartWrapper({ type = 'default', children, ...props }: ChartWrapperProps) {
    if(type === 'default') {
        return (
            <div {...props} data-testid="ds-chart-wrapper-default">
                {children}
            </div>
        )
    }

    return (
        <Card {...props} data-testid="ds-chart-wrapper-card">
            {children}
        </Card>
    )
}