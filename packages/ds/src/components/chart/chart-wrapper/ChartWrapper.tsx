import React from 'react';

import Card from '../../card';

interface ChartContentProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'default' | 'card';
    children: React.ReactNode;
}

export default function ChartWrapper({ type = 'default', children, ...props }: ChartContentProps) {
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