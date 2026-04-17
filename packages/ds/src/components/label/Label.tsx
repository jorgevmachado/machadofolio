import React from 'react';

import { Text } from '../../elements';
import { generateComponentId, joinClass,type TColors } from '../../utils';

import './Label.scss';

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
    tip?: string;
    tag?: 'label' | 'legend';
    color?: TColors;
    label?: string;
}

export default function Label({
    id,    
    tip,
    tag = 'label',
    color = 'neutral-80',
    label,
    className,
    ...props
}: LabelProps) {
    const componentId = id ? id : generateComponentId('ds-label');
    const tipId = `${componentId}-tip`;

    const classNameList = joinClass(['ds-label', className]);
    
    return (
        <div {...props} id={componentId} className={classNameList} data-testid="ds-label">
            { label && (
                <Text
                    id={componentId}
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
