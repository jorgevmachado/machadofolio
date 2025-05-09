import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../../shared';

import { EMonth } from './enum';

export type TMonth =
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december';

export const MONTHS: Array<TMonth> = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
];

export function getCurrentMonth(): EMonth {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        return MONTHS[currentMonth]?.toUpperCase() as EMonth;
    } catch (error) {
        console.error('Error to get current month: ', error);
        return EMonth.JANUARY;
    }
}

export function getMonthIndex(month?: EMonth): number {
    if(!month) {
        return 0;
    }
    return MONTHS.indexOf(month.toLowerCase() as TMonth);
}

export function getMonthByIndex(index: number): TMonth {
    if (index < 0 || index > 11) {
        console.error(`The month index provided is invalid: ${index}`);
        return 'january';
    }
    return MONTHS?.[index] as TMonth;
}

export function isMonthValid(month?: string): void {
    if (!MONTHS.includes(month?.toLowerCase() as TMonth)) {
        throw new Error(`The month provided is invalid: ${month}`);
    }
}

export function monthValidator({ value }: ValidatorParams): ValidatorMessage {
    if (!value && value !== 0) {
        return REQUIRED_FIELD;
    }

    if (typeof value !== 'number') {
        return INVALID_TYPE;
    }

    const invalid = value < 0 || value > 12;

    return {
        valid: !invalid,
        value: !invalid ? value : undefined,
        message: !invalid ? 'Valid month.' : 'Please enter a valid month.',
    };
}

export function parseMonth(value?: string | number): number | undefined {
    if (!value && value !== 0) {
        return;
    }
    const valueNumber = Number(value);

    if (isNaN(valueNumber)) {
        return;
    }

    if (!monthValidator({ value: valueNumber }).valid) {
        return;
    }
    return valueNumber === 0 ? valueNumber : valueNumber - 1;
}