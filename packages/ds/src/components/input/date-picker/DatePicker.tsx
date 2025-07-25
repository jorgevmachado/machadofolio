import React, { useEffect, useState } from 'react';

import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';


import { Icon, type TGenericIconProps } from '../../../elements';
import { type ValidatorProps, generateComponentId, joinClass } from '../../../utils';

import './DatePicker.scss';

type ReactDatePickerProps = React.ComponentProps<typeof ReactDatePicker>;

type OnChangeParams = {
    date?: Date;
    dates?: Array<Date>;
    event: React.SyntheticEvent<any, Event>;
}

export type DatePickerProps = Omit<ReactDatePickerProps, 'icon' | 'selected' | 'value'> & {
    icon?: TGenericIconProps;
    value?: string;
    selected?: Date;
    isInvalid?: boolean;
    placeholder?: string;
    handleInputValidator?: (validator: ValidatorProps) => void;

};

export default function DatePicker({
   id,
   icon,
   value,
   inline,
   selected,
   children,
   showIcon = true,
   isInvalid,
   placeholder,
   handleInputValidator,
   ...props
}: DatePickerProps) {
    const [currentSelectedDate, setCurrentSelectedDate] = useState<Date | null>(selected || null);
    const [currentIcon , setCurrentIcon] = useState<TGenericIconProps | undefined>(icon);

    const componentId = id ?? generateComponentId('ds-input-date-picker');

    const classNameList = joinClass(['ds-input-date-picker', inline && 'ds-input-date-picker__inline']);
    const classNameInputList = joinClass([
        'ds-input-date-picker__field',
        isInvalid && 'ds-input-date-picker__field--error'
    ]);

    useEffect(() => {
        if(value) {
            const date = new Date(value);
            if(date.toString() === 'Invalid Date') {
                handleInputValidator && handleInputValidator({ invalid: true, message: 'Invalid date' });
                return;
            }
            setCurrentSelectedDate(new Date(value));
        }
    }, [handleInputValidator, value]);

    useEffect(() => {
        if( showIcon && !icon) {
            setCurrentIcon({
                icon: 'calendar',
                color: 'info-80',
                position: 'right',
            })
        }
    }, [showIcon, icon]);

    return (
        <div className={classNameList} data-testid="ds-input-date-picker">
            <ReactDatePicker
                id={componentId}
                icon={icon && <Icon {...icon} className={joinClass(['ds-input-date-picker__icon', icon?.className])} />}
                inline={inline}
                showIcon={showIcon}
                selected={currentSelectedDate}
                onChange={(date) => setCurrentSelectedDate(date)}
                className={classNameInputList}
                placeholderText={placeholder}
            />

        </div>
    )
}