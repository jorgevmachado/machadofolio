import React from 'react';

import Button from '../../button';

type ButtonProps = React.ComponentProps<typeof Button>;

export interface ChartFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    action?: ButtonProps;
    className?: string;
    'data-testid'?: string;
}