import React, { useRef } from 'react';

import { useOutsideClick } from '../../hooks';
import { joinClass,type TContext } from '../../utils';

import Activator from './Activator';
import useDropdown from './useDropdown';

import './Dropdown.scss';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'link' | 'button';
    label?: string;
    isOpen?: boolean;
    context?: TContext;
    disabled?: boolean;
    children?: React.ReactNode;
    activator?: React.ReactNode;
    onClickOutside?: (value: boolean) => void;
    onDropDownClick?: (value: boolean) => void;
}

export default function Dropdown({
    type = 'button',
    label = 'activator',
    isOpen: externalIsOpen,
    context = 'neutral',
    disabled = false,
    children,
    className,
    activator,
    onClickOutside,
    onDropDownClick,
    ...props
}: DropdownProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { isOpen, setIsOpen } = useDropdown(externalIsOpen);

    const handleActivatorClick = () => {
        if (disabled) {
            return;
        }

        setIsOpen(!isOpen);

        if (onDropDownClick) {
            onDropDownClick(!isOpen);
        }
    };

    const classNameList = joinClass([
        'ds-dropdown',
        context && `ds-dropdown__context--${context}`,
        className,
    ]);

    useOutsideClick(ref, () => {
        setIsOpen(false);
        if(onClickOutside) {
            onClickOutside(true);
        }
        if(onDropDownClick) {
            onDropDownClick(false);
        }
    }, [setIsOpen]);

    return (
        <div {...props} ref={ref} className={classNameList} data-testid="ds-dropdown">
            <div onClick={handleActivatorClick}>
                {!activator ? (
                    <Activator
                        type={type}
                        label={label}
                        isOpen={isOpen}
                        onClick={handleActivatorClick}
                        context={context}
                    />
                ) : (
                    activator
                )}
            </div>
            {isOpen && (
                <div className={`ds-dropdown__action--${type}`} tabIndex={-1} data-testid="ds-dropdown-action">
                    {children}
                </div>
            )}
        </div>
    );
};
