import React from 'react';

import { Text } from '../../elements';
import { generateComponentId, joinClass } from '../../utils';

import './Feedback.scss';

type FeedbackProps = {
    id?: string;
    context: 'error' | 'success' | 'attention';
    children: React.ReactNode;
    className?: string;
}

export default function Feedback({ id, context, children, className = '' }: FeedbackProps) {
    const componentId = id ? id : generateComponentId('ds-feedback');
    const classNameList = joinClass(['ds-feedback', className]);

    return (
        <Text
            id={componentId}
            role={context === 'error' ? 'alert' : 'status'}
            color={`${context}-80`}
            variant="regular"
            className={classNameList}
            data-testid="ds-feedback"
            aria-live={context === 'error' ? 'assertive' : 'polite'}
        >
            {children}
        </Text>
    );
};
