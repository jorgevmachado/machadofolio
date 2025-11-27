import React, { useState, useRef, useEffect, useMemo } from 'react';

import { joinClass, type OptionsProps } from '../../../../../utils';
import { Icon } from '../../../../../elements';

import './Select.scss';

type SelectProps = {
    id: string;
    name?: string;
    value?: string;
    onInput?: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => void;
    options?: Array<OptionsProps>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value?: string ) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    autoComplete?: boolean;
    fallbackLabel?: string;
    fallbackAction?: (name: string, value?: string) => void;
    filterFunction?: (input: string, option: OptionsProps) => boolean;
}

export default function Select({
                                   id,
                                   name = 'select',
                                   value,
                                   onInput,
                                   options = [],
                                   disabled,
                                   className,
                                   placeholder = 'Select...',
                                   onChange,
                                   autoComplete = false,
                                   fallbackAction,
                                   fallbackLabel,
                                   filterFunction
                               }: SelectProps) {
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(-1);
    const [selectedValue, setSelectedValue] = useState(value ?? '');
    const [closing, setClosing] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsList = useMemo(() => options, [options]);
    const filteredOptions = useMemo(() => {
        if(!autoComplete) {
            return optionsList;
        }

        if(!selectedValue) {
            return optionsList;
        }

        if(filterFunction) {
            return optionsList.filter(opt => filterFunction(selectedValue, opt));
        }

        return optionsList.filter(opt => opt.label.toLowerCase().includes(selectedValue?.toLowerCase()));
    }, [optionsList, autoComplete, selectedValue, filterFunction]);

    useEffect(() => {
        if (value !== undefined && value !== selectedValue) {
            setSelectedValue(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
                setFocused(-1);
            }
        }
        if (open && !disabled) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, disabled]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                e.preventDefault();
                setOpen(true);
                setFocused((prev) => Math.min(prev + 1, optionsList.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setOpen(true);
                setFocused((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                if(open && focused >= 0 && optionsList[focused] ) {
                    selectOption(optionsList[focused].value);
                    return;
                }
                setOpen((o) => !o);
                break;
            case 'Escape':
            case 'Tab':
                setOpen(false);
                setFocused(-1);
                break;
        }
    }

    const selectOption = (value: string) => {
        setSelectedValue(value);
        const event = {
            target: {
                value: value,
                name: name,
            }
        } as React.ChangeEvent<HTMLInputElement>;

        if (onChange) {
            onChange(event, value);
        }

        if(onInput) {
            onInput(event, value);
        }
        setClosing(true);
        setFocused(-1);
        setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, 200);
    }

    const selectedLabel = useMemo(
        () => optionsList.find(opt => opt.value === selectedValue)?.label || '',
        [optionsList, selectedValue]
    );

    const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(!disabled) {
            setOpen((prev) => !prev);
        }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
        setOpen(true);
        setFocused(-1);
        if(onInput) {
            onInput(e, value);
        }
    }

    const handleOptionClick = (value: string) => {
        selectOption(value);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }

    const treatValueAutoComplete = (value: string) => {
        const option = optionsList.find(opt => opt.value === value || opt.label === value);
        return option ? option.label : value;
    }

    const onClickFallback = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        if(fallbackAction) {
            fallbackAction(name, selectedValue);
            setSelectedValue('');
        }
    }

    return (
        <div className="ds-select" ref={wrapperRef} data-testid="ds-select">
            <div
                role="combobox"
                onClick={handleOnClick}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
                className={joinClass([
                    "ds-select__control",
                    open && "ds-select__control--open",
                    !autoComplete && className
                ])}
                aria-label={selectedLabel || placeholder}
                aria-expanded={open}
                aria-controls={open ? `${id}-dropdown` : undefined}
                aria-disabled={disabled}
                aria-activedescendant={open && focused >= 0 ? `${id}-option-${focused}` : undefined}
            >
                {autoComplete
                    ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={treatValueAutoComplete(selectedValue)}
                            onFocus={() => setOpen(true)}
                            onChange={handleOnChange}
                            disabled={disabled}
                            autoComplete="off"
                            className={className}
                            placeholder={placeholder}
                            data-testid="ds-autocomplete-input"
                            aria-autocomplete="list"
                            aria-controls={open ? `${id}-dropdown` : undefined}
                            aria-activedescendant={open && focused >= 0 ? `${id}-option-${focused}` : undefined}

                        />
                    )
                    : (
                        <span className={selectedValue ? "" : "ds-select__placeholder"} data-testid="ds-select-placeholder">
                    {selectedLabel || placeholder}
                </span>
                    )}
                <Icon icon="chevron-down" color="primary-80" size="20" className={joinClass(["ds-select__arrow", open && "ds-select__arrow--open"])} />
                {open || closing ? (
                    <ul
                        id={`${id}-dropdown`}
                        className={joinClass([
                            "ds-select__dropdown",
                            closing && "ds-select__dropdown--closing"
                        ])}
                        role="listbox"
                        aria-labelledby={id}
                    >
                        {filteredOptions.length === 0 ? (
                            <li
                                role="option"
                                onClick={onClickFallback}
                                tabIndex={-1}
                                className="ds-select__option ds-select__option--empty"
                                data-testid="ds-select-fallback">
                                {fallbackAction ? fallbackLabel ?? 'Add' : 'No options'}
                            </li>
                        ) : filteredOptions.map((option, idx) => (
                            <li
                                key={option.value}
                                id={`${id}-option-${idx}`}
                                className={joinClass([
                                    'ds-select__option',
                                    selectedValue === option.value && 'ds-select__option--selected',
                                    focused === idx && 'ds-select__option--focused',
                                ])}
                                role="option"
                                aria-selected={selectedValue === option.label}
                                tabIndex={-1}
                                onClick={() => handleOptionClick(option.value)}
                                onMouseEnter={() => setFocused(idx)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </div>
    );
}