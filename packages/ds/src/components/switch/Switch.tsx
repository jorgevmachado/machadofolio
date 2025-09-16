import React, { useEffect, useState } from 'react';

import { Text } from '../../elements';

import { generateComponentId, joinClass, type TContext } from '../../utils';

import './Switch.scss';

interface SwitchProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label?: React.ReactNode;
    checked?: boolean;
    context?: TContext;
    onChange?: (event: React.MouseEvent<HTMLElement>, checked: boolean) => void;
    disabled?: boolean;
    labelAfter?: React.ReactNode;
    'data-testid'?: string;

}

export default function Switch({
    label,
    checked = false,
    context = 'primary',
    onChange,
    disabled,
    className,
    labelAfter,
    'data-testid': dataTestId = 'ds-switch',
    ...props
}: SwitchProps) {
    const [enable, setEnable] = useState<boolean>(checked);
    const componentId = generateComponentId('switch-');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setEnable((prev) => !prev);
        if (onChange) {
            onChange(event, !enable);
        }
    };

    const classNameList = joinClass([
        'ds-switch',
        `ds-switch__context--${context}`,
        `${disabled ? 'ds-switch__disabled' : ''}`,
         className,
    ]);

    const buttonClassNameList = joinClass([
        'ds-switch__button',
        `${enable ? 'ds-switch__button--checked' : 'ds-switch__button--no-checked'}`,
    ])

    useEffect(() => {
        setEnable(checked)
    }, [checked]);

    return (
        <div {...props} className={classNameList} data-testid={dataTestId}>
            {label && (
                <Text
                    id={`${componentId}-label-before`}
                    tag="label"
                    color="neutral-100"
                    htmlFor={componentId}
                    disabled={disabled}
                    className={joinClass(['ds-switch__label', 'ds-switch__label--before', disabled && 'ds-switch__label--disabled'])}
                    data-testid={`${dataTestId}-label`}
                >
                    {label}
                </Text>
            )}
            <button
                id={componentId}
                type="button"
                role="switch"
                onClick={handleClick}
                disabled={disabled}
                className={buttonClassNameList}
                data-testid={`${dataTestId}-button`}
                aria-checked={enable}
                aria-disabled={disabled ? true : undefined}
                aria-labelledby={`${componentId}-label`}
            />
            {labelAfter && (
                <Text
                    id={`${componentId}-label-after`}
                    tag="label"
                    color="neutral-100"
                    htmlFor={componentId}
                    disabled={disabled}
                    className={joinClass(['ds-switch__label', disabled && 'ds-switch__label--disabled'])}
                    data-testid={`${dataTestId}-label-after`}
                >
                    {labelAfter}
                </Text>
            )}
        </div>
    );
}
