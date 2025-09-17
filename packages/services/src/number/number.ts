import {
 INVALID_TYPE,
 type ValidatorMessage,
 type ValidatorParams
} from '../shared';
import { extractLastItemFromUrl } from '../string';

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

export function ensureOrderNumber(order?: number, url?: string): number {
 if (order) {
  return order;
 }

 if(!url) {
  return 0;
 }

 return extractLastNumberFromUrl(url);
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

export function convertToNumber(value?: string): number {
    if(!value) {
        return 0;
    }

    const rawValue = parseFloat(value);
    if(isNaN(rawValue)) {
        return 0;
    }

    return rawValue;
}