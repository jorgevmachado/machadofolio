import React from 'react';

import { generateComponentId, joinClass } from '../../utils';

import './Card.scss';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export default function Card({
    id,
    style,
    children,
    className,
    'data-testid': dataTestId = 'ds-card',
    ...props
}: Readonly<CardProps>) {
    const componentId = id || generateComponentId('ds-card');
    return (
        <div
            {...props}
            id={componentId}
            style={style}
            className={joinClass(['ds-card', className ])}
            data-testid={dataTestId}
        >
            {children}
        </div>
    );
}