import React from 'react';

import type { TableProps } from '../../types';

import Action from './action';

type ActionsProps = Pick<TableProps, 'actions'> & {
    item: TableProps['items'][number];
}

export default function Actions({ item, actions }: ActionsProps) {
    return actions ? (
        <td
            style={{
                gap: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent:  actions?.align ?? 'center'
            }}
            data-testid="ds-table-body-actions"
        >
            {actions.edit && (
                <Action type="edit" item={item} action={actions.edit} />
            )}
            {actions.delete && (
                <Action type="delete" item={item} action={actions.delete} />
            )}
        </td>
    ) : null;
}