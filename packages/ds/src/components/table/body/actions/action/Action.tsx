import React, { useEffect } from 'react';

import useBreakpoint from '../../../../../hooks/use-breakpoint';
import Button from '../../../../button';
import type { TableActionsItem, TableProps } from '../../../types';

type ActionProps = {
    item: TableProps['items'][number];
    type: 'edit' | 'delete';
    action: TableActionsItem;
}

export default function Action({ type, item, action }: ActionProps) {
    const [icon, setIcon] = React.useState<TableActionsItem['icon']>(action?.icon);
    const [hasIcon, setHasIcon] = React.useState<boolean>(Boolean(icon));

    const { isMobile } = useBreakpoint();
    const defaultText = type === 'edit' ? 'Edit' : 'Delete';
    const defaultContext = type === 'edit' ? 'attention' : 'error';

    useEffect(() => {
        if(isMobile && !hasIcon) {
            setIcon({ icon: type === 'edit' ? 'edit' : 'trash', noBorder: true });
        }
        if(!isMobile && !action?.icon) {
            setIcon(undefined);
        }
    }, [isMobile, type]);

    useEffect(() => {
        setHasIcon(Boolean(icon));
    }, [icon]);

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
            icon={icon}
            onClick={(event) => handleCLick(event, item)}
            context={action?.context ?? defaultContext}
            appearance={hasIcon ? 'icon' : 'standard'}
            data-testid={`ds-table-body-action-${type}`}
        >
            {!hasIcon && (action?.children || defaultText)}
        </Button>
    );
}