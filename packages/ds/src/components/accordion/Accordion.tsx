import React, { useCallback } from 'react';

import { generateComponentId, joinClass, type TContext } from '../../utils';

import { Icon, Text } from '../../elements';

import useAccordion from './useAccordion';

import './Accordion.scss';

interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
    title: string;
    isOpen?: boolean;
    context?: TContext;
    onToggle?: (isOpen: boolean) => void;
    subtitle?: string;
    disabled?: boolean;
    children: React.ReactNode;
    isBorderless?: boolean;
    childrenTitle?: React.ReactNode;
}

export default function Accordion ({
    id,
    title,
    isOpen,
    context = 'primary',
    onToggle,
    children,
    subtitle,
    disabled,
    className,
    isBorderless,
    childrenTitle,
    ...props
}: AccordionProps) {
    const { isOpenModel, toggleOpen } = useAccordion(isOpen, onToggle);
    const componentId = id ?? generateComponentId('ds-accordion');
    const classNameList = joinClass([
        'ds-accordion',
        isBorderless && 'ds-accordion__borderless',
        context && `ds-accordion__context--${context}`,
        disabled && 'ds-accordion__disabled',
        className && className,
    ]);

    const handleToggle = useCallback(() => {
        console.log('handleToggle');
        if (!disabled) {
            toggleOpen();
        }
    }, [disabled, toggleOpen]);

    return (
        <div
            {...props}
            role="presentation"
            tabIndex={disabled ? -1 : 0}
            className={classNameList}
        >
            <button
                id={`${componentId}-accordion-button`}
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className="ds-accordion__button"
                aria-disabled={disabled}
                aria-expanded={isOpenModel}
                aria-controls={`${componentId}-accordion-content`}
            >

                <div className="ds-accordion__button--title">
                    {childrenTitle ? childrenTitle : (<Text variant="regular">{title}</Text>)}
                    {subtitle && <Text variant="regular">{subtitle}</Text>}
                </div>
                <Icon
                    icon="chevron-down"
                    size="20"
                    color={`${context}-80`}
                    className={joinClass(['ds-accordion__arrow', isOpenModel && 'ds-accordion__arrow--open'])}
                />
            </button>
            {isOpenModel && (
                <div
                    id={`${componentId}-accordion-content`}
                    role="region"
                    className="ds-accordion__content"
                    aria-labelledby={`${componentId}-accordion-content`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};
