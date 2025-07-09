import React, { type ComponentProps } from 'react';

import { Icon, Spinner } from '../../../elements';
import type { TColors, TContext } from '../../../utils';
import type { TIconPosition } from '../../../elements/icon';


export type IconProps = ComponentProps<typeof Icon> & {
    noBorder?: boolean;
    position?: TIconPosition;
};

export type NotificationProps = {
    color?: TColors;
    counter: number;
    className?: string;
    backgroundColor?: TColors;
}

export type LoadingProps = {
    value: boolean;
    context?: TContext;
}

type ContentProps = {
    icon?: IconProps;
    context: TContext;
    loading?: LoadingProps;
    children?: React.ReactNode;
    notification?: NotificationProps;
};


export default function Content({
    icon,
    context,
    loading,
    children,
    notification
}: ContentProps) {
    return (
        <div className="ds-button__content">
            { Boolean(icon) && icon?.position === 'left' && (
                <Icon {...icon}/>
            )}
            <>
                <div>{children}</div>
                { (Boolean(notification) && notification?.counter) && (
                    <div className="ds-button__content--notification">
                        <div className={notification?.className}>
                            {notification?.counter > 9 ? '9+' : notification?.counter}
                        </div>
                    </div>
                )}
            </>
            { Boolean(icon) && icon?.position === 'right' && (
                <Icon {...icon}/>
            )}
            {(Boolean(loading) && loading?.value ) && (
                <Spinner size={16} context={loading?.context ?? context} className="ds-button__content--spinner" />
            )}

        </div>
    )
}