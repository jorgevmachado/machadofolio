import React from 'react';

import { joinClass,type TContext } from '../../../utils';

import './Circle.scss';

type CircleProps =  {
    size: number;
    context: TContext;
    'data-testid': string;
}

export default function SpinnerCircle ({ size, context, 'data-testid': dataTestId }: CircleProps) {
    const classNameList = joinClass([
        'ds-spinner-circle',
        `ds-spinner-circle__context--${context}`,
    ]);

    return (
        <div
            style={{
                width: size,
                height: size,
                border: `${size * 0.13}px solid #f3f3f3`,
                borderTop: `${size * 0.13}px solid`,
            }}
            data-testid={`${dataTestId}-circle`}
            className={classNameList}
        />
    )
}