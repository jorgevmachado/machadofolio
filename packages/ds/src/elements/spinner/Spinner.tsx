import React from 'react';

import { type TContext, joinClass } from '../../utils';

import SpinnerCircle from './circle';
import SpinnerDots from './dots';
import SpinnerBar from './bar';

import './Spinner.scss';

type TSpinner = 'circle' | 'dots' | 'bar';

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
    type?: TSpinner;
    size?: number;
    context?: TContext;
    quantity?: number;
    'data-testid'?: string;
}

export default function Spinner({
    type = 'circle',
    size = 32,
    context = 'primary',
    quantity,
    className,
    'data-testid': dataTestId,
    ...props 
}: SpinnerProps) {

    const classNameList = joinClass([
        'ds-spinner',
        className
    ]);

    const currentDataTestId = dataTestId ?? 'ds-spinner';

    return (
        <div
            {...props}
            role="spinner"
            aria-label="spinner..."
            data-testid={currentDataTestId}
            className={classNameList}
        >
            {type === 'circle' && (
                <SpinnerCircle size={size} context={context} data-testid={currentDataTestId} />
            )}
            {type === 'dots' && (
                <SpinnerDots size={size} context={context} quantity={quantity} data-testid={currentDataTestId} />
            )}
            {type === 'bar' && (
                <SpinnerBar size={size} context={context} data-testid={currentDataTestId} />
            )}
        </div>
    );
};
