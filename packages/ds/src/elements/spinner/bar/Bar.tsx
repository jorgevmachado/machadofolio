import React from 'react';

import { joinClass,type TContext } from '../../../utils';

import './Bar.scss';

type BarsProps =  {
    size: number;
    context?: TContext;
    'data-testid': string;
}

export default function SpinnerBar ({ size, context, 'data-testid': dataTestId }: BarsProps) {
    const classNameContentList = joinClass([
        'ds-spinner-bar__content',
        `ds-spinner-bar__context--${context}`,
    ]);

    return (
        <div
            style={{ height: size, borderRadius: size / 2 }}
            className="ds-spinner-bar"
            data-testid={`${dataTestId}-bar`}
        >
            <div
                style={{ borderRadius: size / 2 }}
                className={classNameContentList}
                data-testid={`${dataTestId}-bar-content`}
            />
        </div>
    );

}