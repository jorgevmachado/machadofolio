import React from 'react';

import { type TContext, joinClass } from '../../utils';

import './ProgressIndicator.scss';

type ProgressIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
    total: number;
    current: number;
    context?: TContext;
    'data-testid'?: string;
}

export default function ProgressIndicator({
    total,
    current,
    context = 'primary',
    className,
    'data-testid': dataTestId,
    ...props
}: ProgressIndicatorProps) {
    const classNameList = joinClass(['ds-progress-indicator', className]);
    return (
        <div className={classNameList} data-testid={dataTestId ?? 'ds-progress-indicator'} {...props}>
            {Array.from({ length: total }, (_, i) => {
                const index = i + 1;
                const itemClass = [
                    'ds-progress-indicator__item',
                    current === index && `ds-progress-indicator__item--context-${context}`,
                ]
                    .filter(Boolean)
                    .join(' ');

                return <span key={`page-${index}`} className={itemClass} data-testid={`${dataTestId ?? 'ds-progress-indicator'}-item-${index}`} />;
            })}
        </div>

    );
};
