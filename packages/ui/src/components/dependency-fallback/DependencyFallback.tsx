'use client';
import React, {useMemo} from 'react';

import {Button, joinClass,Text} from '@repo/ds';

import './DependencyFallback.scss';

type TextProps = React.ComponentProps<typeof Text>;
type ButtonProps = React.ComponentProps<typeof Button>;

type DependencyFallbackTextProps = Omit<TextProps, 'children'> & {
  text?: string;
};

type CustomButtonProps = Partial<ButtonProps>;

export type DependencyFallbackButtonProps =
    Omit<CustomButtonProps, 'children'>
    & {
  label: string;
};

type DependencyFallbackProps = {
  button?: DependencyFallbackButtonProps;
  message?: DependencyFallbackTextProps;
  resourceName?: string;
  dependencyName?: string;
  'data-testid'?: string;
};

const DependencyFallback: React.FC<DependencyFallbackProps> = ({
  button,
  message,
  resourceName = 'Resource',
  dependencyName = 'Dependency',
  'data-testid': dataTestId = 'ui-dependency-fallback',
}) => {

  const textMessage = useMemo(() => {
    const customText = {...message};
    const text = customText?.text;
    delete customText.text;
    const defaultProps: TextProps = {
      ...customText,
      children: text ??
          `No list of ${dependencyName} were found. Please create a ${dependencyName} before creating a ${resourceName}!!`,
    };
    return defaultProps;
  }, [message, dependencyName, resourceName]);

  const buttonProps = useMemo(() => {
    if (!button) {
      return undefined;
    }
    return {
      ...button,
      children: button.label,
      context: button?.context || 'primary',
      className: joinClass([
        'ui-dependency-fallback__button',
        button?.className && button.className]),
    };
  }, [button]);

  return (
      <div className="ui-dependency-fallback" data-testid={dataTestId}>
        <Text {...textMessage} data-testid={`${dataTestId}-text`}/>
        {buttonProps && (
            <Button {...buttonProps} data-testid={`${dataTestId}-button`}/>
        )}
      </div>
  );
};

export default DependencyFallback;