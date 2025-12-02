import React from 'react';

import { joinClass,type OptionsProps, type TAppearance, type TContext } from '../../../../../utils';
import Button from '../../../../button';

import './RadioGroup.scss';


export interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onClick'> {
    value?: string | Array<string>;
    context: TContext;
    options: Array<OptionsProps>;
    onClick?: (e: React.MouseEvent<HTMLInputElement>, value?: string | Array<string>) => void;
    appearance: TAppearance;
}

export default function RadioGroup({
    id,
    value,
    context,
    options,
    onClick,
    disabled,
    multiple,
    appearance,
    ...props
}: RadioGroupProps) {

    const classNameList = joinClass([
        'ds-radio-group',
        `ds-radio-group__context--${context}`,
        `ds-radio-group__appearance--${appearance}`,
    ]);

    const selectedValues: Array<string> = React.useMemo(() => {
        if(multiple) {
            if(Array.isArray(value)) {
                return [...new Set(value)];
            }
            if(typeof value === 'string') {
                return [...new Set(value.split(','))];
            }
        }
        return value ? [String(value)] : [];
    },[value, multiple]);

    const toggleValue = (current: string, arr: Array<string>) => {
        if(arr.includes(current)) {
            return arr.filter(value => value !== current);
        }
        return [...arr, current];
    }

    const isChecked = (modelValue: string) => selectedValues.includes(modelValue);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, value: string) => {
        const event = e as React.MouseEvent<HTMLInputElement>;
        if(multiple) {
            handleOnClick(event, toggleValue(value, selectedValues));
            return;
        }
        handleOnClick(event, value);
    };

    const handleOnClick = (e: React.MouseEvent<HTMLInputElement>, value: string | Array<string>) => {
        if(onClick) {
            onClick(e as React.MouseEvent<HTMLInputElement>, value);
        }
    }

    const buttonClassNameList = (value: string) => {
        const baseClassName = 'ds-radio-group__container--button';
        return joinClass([
            baseClassName,
            isChecked(value) && `${baseClassName}-checked`,
        ])
    }

    return (
        <div className={classNameList} data-testid="ds-radio-group">
            <div role="radiogroup" className="ds-radio-group__container">
                {options?.map(({ value }, index) => (
                    <input
                        {...props}
                        id={id}
                        key={`ds-input-radio-group-${value}`}
                        type={multiple ? 'checkbox' : 'radio'}
                        value={value}
                        readOnly={true}
                        tabIndex={-1}
                        aria-hidden="true"
                        checked={isChecked(value)}
                        className="ds-radio-group__container--input"
                        data-testid={`ds-radio-group-field-${index}`}
                    />
                ))}
                {options?.map(({ value, label }, index) => (
                    <Button
                        key={value}
                        role="radio"
                        context={context}
                        onClick={(e) => handleClick(e, value)}
                        tabIndex={isChecked(value) ? 0 : -1}
                        disabled={disabled}
                        className={buttonClassNameList(value)}
                        appearance={isChecked(value) ? 'standard' : 'outline'}
                        aria-checked={isChecked(value)}
                        data-testid={`ds-radio-group-button-${index}`}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    )
};
