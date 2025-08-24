import React from 'react';

import type { TContext } from '../../utils';

export type TSpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
    size?: number;
    context?: TContext;
}