import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../shared';

import { type CreateDateFromYearMonthDayParams, type ParseDate, type ParseStartDateParams, type TDateSeparator, type YearMonthDay } from './types';

import { parseDay } from './day';
import { parseMonth } from './month';
import { parseYear } from './year';

export function isUnderMinimumAge(date: Date, min: number = 18): boolean {
 const ageInDays =
     (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
 return ageInDays < min * 365.25;
}

export function calculateMaxDate(date?: Date, minAge?: number): Date | undefined {
 if ((!date && !minAge) || (minAge && minAge < 0)) {
   return;
 }

 if (minAge) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - minAge);
  return date;
 }

 return date;
}

export function createDateFromYearMonthDay({
 day,
 year,
 month,
 fallback,
 withValidation,
}: CreateDateFromYearMonthDayParams): Date | undefined {
 const {
  year: currentYear,
  month: currentMonth,
  day: currentDay,
 } = validateYearMonthDay({ day, year, month }, fallback, withValidation);

 return currentYear !== undefined &&
 currentMonth !== undefined &&
 currentDay !== undefined
     ? new Date(currentYear, currentMonth, currentDay)
     : undefined;
}

function validateYearMonthDay(
    value: YearMonthDay,
    fallback?: boolean,
    withValidation?: boolean,
): YearMonthDay {
 const currentDate = new Date();
 const day = withValidation ? parseDay(value?.day) : value?.day;
 const year = withValidation ? parseYear(value?.year) : value?.year;
 const month = withValidation ? parseMonth(value?.month) : value?.month;
 return {
  day: day === undefined && fallback ? currentDate.getDate() : day,
  year: year === undefined && fallback ? currentDate.getFullYear() : year,
  month: month === undefined && fallback ? currentDate.getMonth() : month,
 };
}

export function parseStartDate({ stringDate, initialDate }: ParseStartDateParams): Date | undefined {
 if (stringDate) {
  return parseDateFromString(stringDate);
 }

 return parseInitialDate(initialDate);
}

export function parseDateFromString(
    value: string,
    dateSeparators: Array<TDateSeparator> = ['-', '/'],
): Date | undefined {
 const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
 const currentValue = isoRegex.test(value) ? value.split('T')[0] : value;
 return dateSeparators
     .map((separator) => parseDateFromStringWithSeparator(currentValue, separator))
     .filter((date) => date !== undefined)
     .shift();
}

export function parseDateFromStringWithSeparator(
    value: string,
    separator: TDateSeparator = '-',
): Date | undefined {
 const splitValue = splitDateString(value, separator);
 return !splitValue ? undefined : createDateFromParts(splitValue);
}

function splitDateString(
    value: string,
    separator: TDateSeparator,
): Array<string> | undefined {
 const array = value.split(separator);
 return array.length === 3 ? normalizeDateParts(array, separator) : undefined;
}

function normalizeDateParts(
    array: Array<string>,
    separator: string,
): Array<string> {
 switch (separator) {
  case '/':
   return array.reverse();
  case '-':
  default:
   return array;
 }
}

function createDateFromParts(array: Array<string>): Date | undefined {
 const year = parseYear(array[0]);
 const month = parseMonth(array[1]);
 const day = parseDay(array[2]);
 return createDateFromYearMonthDay({ year, month, day });
}

function parseInitialDate(initialDate?: ParseDate): Date | undefined {
 if (!initialDate) {
  return;
 }

 return (
     initialDate.date ??
     createDateFromYearMonthDay({
      day: initialDate.day,
      year: initialDate.year,
      month: initialDate.month,
      fallback: true,
      withValidation: true,
     })
 );
}

export function dateOfBirthValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }

 if (typeof value === 'number' || typeof value === 'boolean') {
  return INVALID_TYPE;
 }

 const date = typeof value !== 'string' ? value : new Date(value);

 if (date.toString() === 'Invalid Date') {
  return {
   valid: false,
   message: 'Invalid date.',
  };
 }

 return isUnderMinimumAge(date)
     ? {
      valid: false,
      message: 'You must be over 18 years old.',
     }
     : {
      valid: true,
      value,
      message: 'valid date.',
     };
}

export function isDateString({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }

 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }

 const dateRegex =
     /^(\d{4}-\d{2}-\d{2}([Tt]\d{2}:\d{2}(:\d{2}(\.\d+)?)?([Zz]|[+-]\d{2}:\d{2})?)?)|(\d{2}\/\d{2}\/\d{4})$/;
 const valid = dateRegex.test(value);
 return {
  valid,
  value: valid ? value : undefined,
  message: valid ? 'Valid date string.' : 'Please enter a valid date string.',
 };


}