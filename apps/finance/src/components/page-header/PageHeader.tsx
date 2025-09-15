'use client'

import React from 'react';

import { Button, Text } from '@repo/ds';

import './PageHeader.scss';

type PageHeaderProps = {
    action?: {
        label: string;
         onClick: () => void;
         disabled?: boolean;
    };
    resourceName: string;
}

export default function PageHeader({
    action,
    resourceName,
}: PageHeaderProps) {
    return (
        <div className="page-header">
            <Text id="page-header-title" tag="h1" variant="big">
                Management of {resourceName}
            </Text>
            {action && (
                <Button id="page-header-action" onClick={action.onClick} context="success" disabled={action?.disabled}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}