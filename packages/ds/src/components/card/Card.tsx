import React from 'react';

type CardProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className, style }: CardProps) {
    return (
        <div
            className={className}
            style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '1.5rem',
                ...style,
            }}
        >
            {children}
        </div>
    );
}