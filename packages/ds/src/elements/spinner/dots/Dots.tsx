import React from 'react';

import { type TContext, joinClass } from '../../../utils';

import './Dots.scss';

type DotsProps =  {
    size: number;
    context?: TContext;
    quantity?: number;
    'data-testid': string;
}

export default function SpinnerDots ({ size, context, quantity = 3, 'data-testid': dataTestId }: DotsProps) {
    const dotSize = size * 0.18;

    const classNameList = joinClass([
        'ds-spinner-dots',
        `ds-spinner-dots__context--${context}`,
    ]);

    const arrayFrom = (quantity: number) => {
        if (quantity <= 0) {
            return Array.from({ length: 3 }, (_, i) => i);
        }
        const length = quantity >= 10 ? 10 : quantity;
        return Array.from({ length }, (_, i) => i);
    };

    return (
        <div style={{ display: 'flex', gap: dotSize * 0.5 }} data-testid={`${dataTestId}-dots`}>
            {arrayFrom(quantity).map(index => (
                <div
                    key={index}
                    style={{
                        width: dotSize,
                        height: dotSize,
                        animation: `loader-dots-bounce 0.7s ${index * 0.12}s infinite alternate`,
                    }}
                    className={classNameList}
                    data-testid={`${dataTestId}-dots-item-${index}`}
                />
            ))}
        </div>
    );

}