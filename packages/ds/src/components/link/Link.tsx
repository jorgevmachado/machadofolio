import React, { type ComponentProps } from 'react';

import { type TColors, type TContext, type TSimplySIze, type TWeight, joinClass} from '../../utils';

import { Icon, type TIconPosition } from '../../elements';

import './Link.scss';

type IconProps = ComponentProps<typeof Icon> & {
    position?: TIconPosition;
};

type NotificationProps = {
    color?: TColors;
    counter: number;
    className?: string;
    backgroundColor?: TColors;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    icon?: IconProps;
    size?: TSimplySIze;
    weight?: TWeight;
    context?: TContext;
    children: React.ReactNode;
    notification?: NotificationProps;
    'data-testid'?: string;
}

export default function Link({
    icon,
    size = 'medium',
    weight = 'regular',
    context = 'neutral',
    children,
    className,
    notification,
    'data-testid': dataTestId,
    ...props
}: LinkProps) {

    const parentClassName = 'ds-link';

    const classNameList = joinClass([
        parentClassName,
        `${parentClassName}__context--${context}`,
         `${parentClassName}__size--${size}`,
        `${parentClassName}__weight--${weight}`,
        className,
    ]);

    const iconClassNameList = icon &&  joinClass([
        `${parentClassName}__icon--position-${icon?.position ?? 'left'}`,
        icon?.color && `ds-color-${icon.color}`,
        icon?.className,
    ]);

    const notificationClassNameList = notification && joinClass([
        `${parentClassName}__notification--counter`,
         notification?.color ? `ds-color-${notification.color}` : 'ds-color-white',
         notification?.backgroundColor ? `ds-background-color-${notification.backgroundColor}` : `ds-background-color-${context}-80`,
         notification?.className,
    ]);

    return (
        <a {...props } className={classNameList} data-testid={ dataTestId ?? 'ds-link'}>
            <div className="ds-link__content">
                {icon && (icon?.position === 'left' || !icon?.position) && (
                    <Icon {...icon} className={iconClassNameList} />
                )}
                <>
                    <div>{children}</div>
                    {notification && (
                        <div className="ds-link__notification" data-testid="ds-link-notification">
                            <div className={notificationClassNameList} data-testid="ds-link-notification-counter">
                                {notification?.counter > 9 ? '9+' : notification?.counter}
                            </div>
                        </div>
                    )}
                </>
                {icon && icon?.position === 'right' && (
                    <Icon {...icon} className={iconClassNameList} />
                )}
            </div>
        </a>
    );
};
