import React, { useCallback } from 'react';

import { Icon, type TIcon } from '../../elements';
import { joinClass } from '../../utils';

import './Alert.scss';

type TAlert = 'info' | 'error' | 'warning' | 'success';

type LinkProps = {
    label: string;
    onClick: () => void;
}

interface AlertProps extends React.HTMLProps<HTMLDivElement> {
    type: TAlert;
    icon?: React.ReactNode | TIcon;
    link?: LinkProps;
    onClose?: () => void;
    children: React.ReactNode;
    'data-testid'?: string;
}

export default function Alert({
    type,
    icon,
    link,
    onClose,
    children,
    className,
    'data-testid': dataTestId,
    ...props
}: AlertProps) {

    const classNameList = joinClass([
        'ds-alert',
        type && `ds-alert__type--${type}`,
        Boolean(onClose) && 'ds-alert__borderless',
        className
    ])

    const ariaLive = type === 'error' || type === 'warning' ? 'assertive' : 'polite';

    const handleLinkClick = useCallback(() => {
        if (link?.onClick) {
            link.onClick();
        }
    }, [link]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div
            {...props}
            className={classNameList}
            aria-live={ariaLive}
            data-testid={dataTestId ?? 'ds-alert'}>
            <Icon icon={icon ?? type} className="ds-alert__icon--title" data-testid="ds-alert-icon-title" />
            <div className="ds-alert__content">
                {children}
                {link && (
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={handleLinkClick}
                        className="ds-alert__content--link"
                        onKeyDown={(e) => e.key === 'Enter' && link.onClick()}
                        data-testid="ds-alert-link"
                    >
                        {link.label}
                    </span>
                )}
            </div>
            {onClose && (
                <Icon
                    icon="close"
                    className="ds-alert__icon--close"
                    onClick={handleClose}
                    data-testid="ds-alert-icon-close"
                />
            )}
        </div>
    );
};
