import React from 'react';

import { type TColors, joinClass } from '../../utils';

import { Text } from '../../elements';

import './Label.scss';

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
    tip?: string;
    tag?: 'label' | 'legend';
    color?: TColors;
    label?: string;
    componentId?: string;
}

export default function Label({ 
    tip,
    tag = 'label',
    color = 'neutral-80',
    label,
    className,
    componentId,
    ...props
}: LabelProps) {
    const tipId = componentId ? `${componentId}-tip` : undefined;

    const classNameList = joinClass(['ds-label', className]);
    
    return (
        <div {...props} className={classNameList} data-testid="ds-label">
            { label && (
                <Text
                    tag={tag}
                    color={color}
                    htmlFor={tag === 'label' ? componentId : undefined}
                    className="ds-label__text"
                    aria-describedby={tip ? tipId : undefined}>
                    {label}
                </Text>
            )}
            { tip && (
                <Text id={tipId} color={color} tag="span" variant="small">
                    {tip}
                </Text>
            )}
        </div>
    );
};
