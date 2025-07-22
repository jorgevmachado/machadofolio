import React from 'react';

import { joinClass } from '../../utils';

import { Text } from '../../elements';

import './Feedback.scss';

type FeedbackProps = {
    id?: string;
    context: 'error' | 'success' | 'attention';
    children: React.ReactNode;
    className?: string;
}

export default function Feedback({ id, context, children, className = '' }: FeedbackProps) {
    const classNameList = joinClass(['ds-feedback', className]);

    return (
        <Text
            id={id}
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
