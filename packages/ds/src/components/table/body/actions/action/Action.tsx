import React from 'react';

import Button from '../../../../button';

import type { TableActionsItem, TableProps } from '../../../types';


type ActionProps = {
    item: TableProps['items'][number];
    type: 'edit' | 'delete';
    action: TableActionsItem;
}

export default function Action({ type, item, action }: ActionProps) {
    const defaultText = type === 'edit' ? 'Edit' : 'Delete';
    const defaultContext = type === 'edit' ? 'attention' : 'error';

    const handleCLick = (
        event: React.MouseEvent<HTMLButtonElement>,
        item: unknown,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        action?.onClick(item);
    }

    return (
        <Button
            icon={action?.icon}
            onClick={(event) => handleCLick(event, item)}
            context={action?.context ?? defaultContext}
            appearance={action?.icon ? 'icon' : 'standard'}
            data-testid={`ds-table-body-action-${type}`}
        >
            {!action?.icon && (action?.children || defaultText)}
        </Button>
    );
}