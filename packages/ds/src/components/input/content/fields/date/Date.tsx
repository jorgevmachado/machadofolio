import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Icon, type TGenericIconProps } from '../../../../../elements';
import { joinClass } from '../../../../../utils';

import { useInput } from '../../../InputContext';

import './Date.scss';

interface DateProps extends Omit<React.ComponentProps<typeof DatePicker>,
    'icon' |
    'value' |
    'selected' |
    'onChange' |
    'children' |
    'selectsRange' |
    'selectsMultiple' |
    'placeholderText' |
    'showMonthYearDropdown'
> {
    min?: string | number;
    max?: string | number;
    icon?: TGenericIconProps;
    value?: string | Array<string>;
    onOpen?: () => void;
    onInput?: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => void;
    onClose?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
    placeholder?: string;
}

export default function DateInput({
    min,
    max,
    icon,
    value,
    onOpen,
    onInput,
    onClose,
    minDate,
    maxDate,
    onChange,
    disabled,
    className,
    placeholder,
    ...props
}: DateProps) {
    const [currentSelectedDate, setCurrentSelectedDate] = useState<Date | undefined>(undefined);
    const [currentMinDate, setCurrentMinDate] = useState<Date | undefined>(undefined);
    const [currentMaxDate, setCurrentMaxDate] = useState<Date | undefined>(undefined);

    const { hasCalendar, calendarElement } = useInput();

    const handleOnChange = (date: Date | null, e?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => {
        if(date) {
            setCurrentSelectedDate(date);
        }

        if(onChange) {
            onChange(e as unknown as React.ChangeEvent<HTMLInputElement>, date?.toISOString());
        }
        if(onInput) {
            onInput(e as unknown as React.FormEvent<HTMLInputElement>,  date?.toISOString());
        }
    }

    const handleCalendarClose = () => {
        if(onClose) {
            onClose();
        }
        if(props?.onCalendarClose) {
            props.onCalendarClose();
        }
    };

    const handleCalendarOpen = () => {
        if(onOpen) {
            onOpen();
        }
        if(props?.onCalendarOpen) {
            props.onCalendarOpen();
        }
    };

    const classNameList = joinClass([
        'ds-date-input',
    ]);

    const classNameInputList = joinClass([
        'ds-date-input__field',
        (!icon?.position || icon?.position === 'left') && 'ds-date-input__field--icon-left',
        (icon?.position === 'right') && 'ds-date-input__field--icon-right',
        className
    ]);

    useEffect(() => {
        if(value) {
            const dateValue = new Date(value as string);
            if(dateValue.toString() !== 'Invalid Date') {
                setCurrentSelectedDate(dateValue);
            }
        }
    },[value]);

    useEffect(() => {
        if(min) {
            const dateMin = new Date(min as string);
            if(dateMin.toString() !== 'Invalid Date') {
                setCurrentMinDate(dateMin);
            }
        }
        if(max) {
            const dateMax = new Date(max as string);
            if(dateMax.toString() !== 'Invalid Date') {
                setCurrentMaxDate(dateMax);
            }
        }
        if(!min && !max) {
            if(minDate) {
                setCurrentMinDate(minDate);
            }
            if(maxDate) {
                setCurrentMaxDate(maxDate);
            }
        }
    }, [min, max, minDate, maxDate]);

    const classNameIconList = joinClass([
        'ds-date-input__icon',
        (!icon?.position || icon?.position === 'left') && 'ds-date-input__icon--left',
        (icon?.position === 'right') && 'ds-date-input__icon--right',
        icon?.className
    ]);

    return (
        <div className={classNameList} data-testid="ds-date-input">
            <DatePicker
                { ...props}
                icon={icon && <Icon {...icon} className={classNameIconList} />}
                minDate={currentMinDate}
                maxDate={currentMaxDate}
                showIcon={Boolean(icon)}
                onChange={handleOnChange}
                disabled={disabled}
                selected={currentSelectedDate}
                className={classNameInputList}
                onCalendarOpen={handleCalendarOpen}
                onCalendarClose={handleCalendarClose}
                placeholderText={placeholder}
                toggleCalendarOnIconClick={Boolean(icon)}
            >
                {hasCalendar && calendarElement}
            </DatePicker>
        </div>
    )
}