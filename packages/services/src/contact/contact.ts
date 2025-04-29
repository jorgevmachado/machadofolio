import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../shared';

export function emailValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }
 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }
 const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
 const valid = regex.test(value);
 return {
  valid,
  value: valid ? value : undefined,
  message: valid ? 'Valid Email.' : 'Please enter a valid email.',
 };
}

export function phoneValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }
 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }
 const regex = /^\(?\d{2}\)? ?\d{4}-?\d{4}$/;
 const valid = regex.test(value);
 return {
  valid,
  value: valid ? value : undefined,
  message: valid
      ? 'Valid phone number.'
      : 'Please enter a valid phone number.',
 };
}

export function mobileValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }
 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }
 const regex = /^\(?\d{2}\)? ?\d{5}-?\d{4}$/;
 const valid = regex.test(value);
 return {
  valid,
  value: valid ? value : undefined,
  message: valid
      ? 'Valid mobile number.'
      : 'Please enter a valid mobile number.',
 };
}

export function phoneFormatter(value?: string): string {
 if (!value) {
  return '';
 }
 return value
     .replace(/\D/g, '')
     .replace(/(\d{2})(\d)/, '($1) $2')
     .replace(/(\d)(\d{4})$/, '$1-$2')
     .substring(0, 15);
}

export function mobileFormatter(value?: string): string {
 if (!value) {
  return '';
 }
 return value
     .replace(/\D/g, '')
     .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}