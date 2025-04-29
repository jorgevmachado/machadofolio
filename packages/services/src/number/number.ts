import {
 INVALID_TYPE,
 type ValidatorMessage,
 type ValidatorParams
} from "../shared";
import {extractLastItemFromUrl} from "../string";

export function isNumberEven(value: number): boolean {
 if (value % 1 !== 0) {
  throw new Error('Please enter a integer number');
 }
 return value % 2 === 0;
}

export function extractLastNumberFromUrl(url?: string): number {
 const lastItem = extractLastItemFromUrl(url);
 const lastNumber = Number(lastItem);
 if (isNaN(lastNumber)) {
  return 0;
 }
 return lastNumber;
}

export type TCountry = 'br';

export function currencyFormatter(
    value: number = 0,
    country: TCountry = 'br',
): string {
 const MAP = {
  br: { locale: 'pt-BR', currency: 'BRL' },
 };
 const mapped = MAP[country];

 return new Intl.NumberFormat(mapped.locale, {
  style: 'currency',
  currency: mapped.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  maximumSignificantDigits: 7,
 })
     .format(value)
     .replace(/\s/, ' ');
}

export function removeCurrencyFormatter(value: string): number {
 return Number(value.replace(/[^0-9,-]+/g, ''));
}

export function numberValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return {
   valid: false,
   message: 'Please enter a valid number.',
  };
 }
 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }
 const regex = /^[0-9]+$/;
 const valid = regex.test(value);
 return {
  valid,
  value: valid ? value : undefined,
  message: valid ? 'valid number.' : 'Please enter a valid number.',
 };
}