import React, { useEffect } from 'react';

import { Alert as AlertDS } from '@repo/ds';

import Alert from './Alert';

type AlertComponentProps = {
    alert: Alert;
    onRemove: (alert: Alert) => void;
}

export default function AlertComponent({
    alert,
    onRemove
}: AlertComponentProps) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onRemove(alert);
        }, alert.delay);

        return () => clearTimeout(timeout);
    }, [alert, onRemove]);

    return (
        <AlertDS
            type={alert.type}
            icon={alert?.icon}
            onClose={() => onRemove(alert)}
            children={alert.message as string}
            data-testid={`alert-component-${alert.id}`}
        />
    )
}