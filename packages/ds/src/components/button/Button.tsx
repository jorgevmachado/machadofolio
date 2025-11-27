import React, { useEffect, useState } from 'react';

import { type TContext, type TSimplySIze, type TWeight, joinClass } from '../../utils';

import { Icon, type TGenericIconProps } from '../../elements';

import { Content, type LoadingProps, type NotificationProps } from './Content';

import './Button.scss';

type TAppearance = 'icon' | 'outline' | 'standard' | 'borderless';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
    icon?: TGenericIconProps;
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
    'data-testid'?: string;
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
                           'data-testid': dataTestId,
                           ...props
                       }: ButtonProps) {
    const [currentIcon, setCurrentIcon] = useState<TGenericIconProps | undefined>(icon);

    const hasLabel = Boolean(children);
    const isAppearanceIconButton = appearance === 'icon' && Boolean(currentIcon);

    useEffect(() => {
        if (icon) {
            setCurrentIcon({
                ...icon,
                position: icon?.position || 'left',
                className: 'ds-button__content--icon'
            });
        }
    }, [icon]);

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
        isAppearanceIconButton && currentIcon?.noBorder
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
            data-testid={dataTestId ?? 'ds-button'}
            aria-disabled={disabled || loading?.value ? 'true' : undefined}
        >
            {isAppearanceIconButton && currentIcon
                ? (
                    <Icon {...currentIcon} />
                )
                : (
                    <Content
                        icon={currentIcon}
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