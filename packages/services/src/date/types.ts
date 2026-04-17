export type TDateSeparator = '-' | '/';

export interface YearMonthDay {
    day?: number;
    year?: number;
    month?: number;
}

export interface CreateDateFromYearMonthDayParams extends YearMonthDay {
    fallback?: boolean;
    withValidation?: boolean;
}

export interface ParseDate extends YearMonthDay {
    date?: Date;
}

export interface ParseStartDateParams {
    stringDate?: string;
    initialDate?: ParseDate;
}