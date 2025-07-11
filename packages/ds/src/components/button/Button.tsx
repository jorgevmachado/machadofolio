import React, { useEffect } from 'react';

import { type TContext, type TSimplySIze, type TWeight } from '../../utils';
import joinClass from '../../utils/join-class';

import { Icon } from '../../elements';

import { Content, type IconProps, type LoadingProps, type NotificationProps } from './Content';

import './Button.scss';

type TAppearance = 'icon' | 'outline' | 'standard' | 'borderless';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
    icon?: IconProps;
    size?: TSimplySIze;
    fluid?: boolean;
    focus?: boolean;
    weight?: TWeight;
    loading?: LoadingProps;
    rounded?: boolean;
    context?: TContext;
    selected?: boolean;
    children?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    appearance?: TAppearance;
    notification?: NotificationProps;
}

export function Button({
                           icon,
                           size = 'medium',
                           fluid,
                           focus = false,
                           weight = 'regular',
                           loading,
                           rounded,
                           context = 'neutral',
                           selected,
                           children,
                           disabled,
                           className,
                           notification,
                           appearance = 'standard',
                           ...props
                       }: ButtonProps) {

    const hasLabel = Boolean(children);
    const isAppearanceIconButton = appearance === 'icon' && Boolean(icon);

    useEffect(() => {
        if (!hasLabel && !props['aria-label']) {
            console.warn('You must define the aria-label if the button has no label');
        }
    }, [hasLabel, props]);

    const parentClassName = 'ds-button';

    const classNameList = joinClass([
        parentClassName,
        size && `${parentClassName}__size--${size}`,
        fluid && `${parentClassName}__fluid`,
        focus && `${parentClassName}__focus`,
        weight && `${parentClassName}__weight--${weight}`,
        rounded && `${parentClassName}__rounded`,
        context && `${parentClassName}__context--${context}`,
        selected && `${parentClassName}__selected`,
        !hasLabel && `${parentClassName}__no-label`,
        isAppearanceIconButton && icon?.noBorder
            ? `${parentClassName}__appearance--no-icon-border`
            : `${parentClassName}__appearance--${appearance}`,
        className,
    ]);

    return (
        <button
            {...props}
            role={appearance === 'icon' ? 'button' : undefined}
            disabled={disabled || loading?.value}
            className={classNameList}
            aria-busy={loading?.value ? 'true' : undefined}
            data-testid="ds-button"
            aria-disabled={disabled || loading?.value ? 'true' : undefined}
        >
            {isAppearanceIconButton && icon
                ? (
                    <Icon {...icon} />
                )
                : (
                    <Content
                        icon={icon}
                        loading={loading}
                        context={context}
                        notification={notification}>
                        {children}
                    </Content>
                )
            }
        </button>
    );
}
