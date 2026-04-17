import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../../shared';

import { EMonth } from './enum';

export type CycleOfMonths = {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
}

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

type SplitMonthsByInstallmentResult = {
    monthsForNextYear: Array<EMonth>;
    monthsForCurrentYear: Array<EMonth>;
}

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

export function totalByMonth<T extends Record<string, unknown>>(month: TMonth, items: Array<T>): number {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }

    return items
        .map(obj => obj[month])
        .filter((value): value is number => typeof value === 'number' && !isNaN(value))
        .reduce((acc, num) => acc + num, 0);
}

export function getMonthNumber(month?: string): number {
    isMonthValid(month);
    return MONTHS.indexOf(month?.toLowerCase() as TMonth) + 1;
}

export function getCurrentMonthNumber(month?: number | string): number {
    switch (typeof month) {
        case 'number':
            if(month < 1 || month > 12) {
                throw new Error(`The month provided is invalid: ${month}`);
            }
            return month;
        case 'string':
            return getMonthNumber(month);
        default:
            throw new Error('The month is required');
    }
}

export function convertTypeToEnum(month?: TMonth): EMonth {
    if(!month) {
        return EMonth.JANUARY;
    }
    return month.toUpperCase() as EMonth;
}

export function splitMonthsByInstalment(year: number, instalments: number, month?: EMonth): SplitMonthsByInstallmentResult {
    const currentMonth = month ?? getCurrentMonth();

    const startMonthIndex = getMonthIndex(currentMonth);

    const monthsForCurrentYear: Array<EMonth> = [];
    const monthsForNextYear: Array<EMonth> = [];

    for (let i = 0; i < instalments; i++) {
        const monthIndex = (startMonthIndex + i) % 12;
        const currentYear = year + Math.floor((startMonthIndex + i) / 12);

        if (currentYear === year) {
            monthsForCurrentYear.push(convertTypeToEnum(getMonthByIndex(monthIndex)));
        } else {
            monthsForNextYear.push(convertTypeToEnum(getMonthByIndex(monthIndex)));
        }
    }

    return { monthsForCurrentYear, monthsForNextYear };
}