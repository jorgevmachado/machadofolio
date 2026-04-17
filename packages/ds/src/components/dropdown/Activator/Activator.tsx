import React, { useMemo } from 'react';

import { type TContext } from '../../../utils';
import Button from '../../button';
import Link from '../../link';

interface ActivatorProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'link' | 'button';
    label: string;
    isOpen?: boolean;
    context: TContext;
    onClick?: () => void;
}
export default function Activator({
    type,
    label,
    isOpen,
    context,
    onClick,
    className,
    ...props
}: ActivatorProps) {
    const icon = useMemo(() => (isOpen ? 'chevron-up' : 'chevron-down'), [isOpen]);
    return (
        <div {...props} className={className}>
            {type === 'button' ? (
                <Button
                    icon={{ icon, size: '1.5em', position: 'right' }}
                    type={type}
                    onClick={onClick}
                    context={context}
                >
                    {label}
                </Button>
            ) : (
                <Link
                    icon={{ icon, position: 'right' }}
                    onClick={onClick}
                    context={context}
                >
                    {label}
                </Link>
            )}
        </div>
    )
}