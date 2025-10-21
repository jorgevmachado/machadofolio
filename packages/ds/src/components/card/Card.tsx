import React from 'react';

import { generateComponentId, joinClass } from '../../utils';

import './Card.scss';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ id, children, className, style, ...props }: CardProps) {
    const componentId = id ? id : generateComponentId('ds-card');
    return (
        <div
            {...props}
            id={componentId}
            style={style}
            className={joinClass(['ds-card', className && className])}
            data-testid="ds-card"
        >
            {children}
        </div>
    );
}