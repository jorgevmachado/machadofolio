import React ,{ useMemo } from 'react';

import { Button ,Icon ,joinClass ,Text } from '@repo/ds';

import './PageHeader.scss';

type ButtonProps = React.ComponentProps<typeof Button>;
type IconProps = React.ComponentProps<typeof Icon>;

type PageHeaderProps = {
  action?: Omit<ButtonProps, 'children'> & { label: string };
  actionIcon?: IconProps;
  resourceName: string;
  'data-testid'?: string;
}

export default function PageHeader({ action, actionIcon, resourceName, 'data-testid': dataTestId = 'ui-page-header' ,}: PageHeaderProps) {

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

  const actionIconProps = useMemo(() => {
    if(!actionIcon) {
      return undefined;
    }
    const defaultProps: IconProps = {
      id: 'ui-page-header-action-icon',
      icon: 'upload',
      className: joinClass(['ui-page-header__container--action-icon',actionIcon.className && actionIcon.className])
    }
    return {...defaultProps, ...actionIcon};
  }, [actionIcon])


    return (
      <div className="ui-page-header" data-testid={dataTestId}>
        <div className="ui-page-header__container">
          <Text id="ui-page-header-title" tag="h1" variant="big" data-testid={`${dataTestId}-title`}>
            {resourceName}
          </Text>
          {actionIconProps && (
            <Icon {...actionIconProps } data-testid={`${dataTestId}-action-icon`}/>
          )}
        </div>
        {
          buttonProps && (
            <Button {...buttonProps} data-testid={`${dataTestId}-action`}>{buttonProps.children}</Button>
          )
        }
      </div>
    )
}