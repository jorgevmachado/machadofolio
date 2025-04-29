import {
    INVALID_TYPE,
    REQUIRED_FIELD,
    ValidatorMessage,
    ValidatorParams
} from "../../shared";

import { EMonth } from "./enum";

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
    const month = new Date().getMonth();
    return MONTHS[month].toUpperCase() as EMonth;
}

export function getMonthIndex(month: EMonth): number {
    return MONTHS.indexOf(month.toLowerCase() as TMonth);
}

export function getMonthByIndex(index: number): TMonth {
    return MONTHS[index];
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
    }
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