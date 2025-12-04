import React ,{ useMemo } from 'react';

import { Button ,Text } from '@repo/ds';

import './PageHeader.scss';

type ButtonProps = React.ComponentProps<typeof Button>;

type PageHeaderProps = {
  action?: Omit<ButtonProps, 'children'> & { label: string };
  resourceName: string;
  'data-testid'?: string;
}

export default function PageHeader({ action, resourceName, 'data-testid': dataTestId = 'ui-page-header' ,}: PageHeaderProps) {

  const buttonProps = useMemo(() => {
    if(!action) {
      return undefined;
    }
    const defaultProps: ButtonProps = {
      id: 'ui-page-header-action',
      context: 'success'
    }
    const { label, ...rest } = action;

    return { ...defaultProps, ...rest, children: label };
  }, [action]);

    return (
      <div className="ui-page-header" data-testid={dataTestId}>
        <Text id="ui-page-header-title" tag="h1" variant="big" data-testid={`${dataTestId}-title`}>
          {resourceName}
        </Text>
        {
          buttonProps && (
            <Button {...buttonProps} data-testid={`${dataTestId}-action`}>{buttonProps.children}</Button>
          )
        }
      </div>
    )
}