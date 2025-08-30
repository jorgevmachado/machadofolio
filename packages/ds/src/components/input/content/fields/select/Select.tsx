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
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(-1);
    const [selectedValue, setSelectedValue] = useState(value ?? '');
    const [closing, setClosing] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const optionsList = useMemo(() => options, [options]);

    useEffect(() => {
        if (value !== undefined && value !== selectedValue) {
            setSelectedValue(value);
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
                setFocused(-1);
            }
        }
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (disabled) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setFocused((prev) => Math.min(prev + 1, optionsList.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            setFocused((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (open && focused >= 0) {
                if (optionsList) {
                    selectOption(optionsList?.[focused]?.value ?? '');
                }
            } else {
                setOpen((o) => !o);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
            setFocused(-1);
        } else if (e.key === 'Tab') {
            setOpen(false);
            setFocused(-1);
        }
    }

    function selectOption(value: string) {
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

    const selectedLabel = optionsList.find(opt => opt.value === selectedValue)?.label || '';

    return (
        <div className="ds-select" ref={wrapperRef} data-testid="ds-select">
            <div
                className={joinClass([
                    "ds-select__control",
                    open && "ds-select__control--open",
                    className
                ])}
                onClick={() => !disabled && setOpen((o) => !o)}
                role="combobox"
                aria-label={selectedLabel || placeholder}
                aria-expanded={open}
                aria-controls={open ? `${id}-dropdown` : undefined}
                aria-disabled={disabled}
                aria-activedescendant={open ? `${id}-option-${focused}` : undefined}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
            >
                <span className={selectedValue ? "" : "ds-select__placeholder"} data-testid="ds-select-placeholder">
                    {selectedLabel || placeholder}
                </span>
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
                        {optionsList.map((option, idx) => (
                            <li
                                key={option.value}
                                id={`${id}-option-${idx}`}
                                className={joinClass([
                                    'ds-select__option',
                                    selectedValue === option.value && 'ds-select__option--selected',
                                    focused === idx && 'ds-select__option--focused',
                                ])}
                                role="option"
                                aria-selected={selectedValue === option.value}
                                tabIndex={-1}
                                onClick={() => selectOption(option.value)}
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