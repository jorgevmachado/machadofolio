import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../shared';

import { EGender } from './enum';

export function cpfFormatter(value?: string): string {
 if (!value) {
  return '';
 }
 return value
     .replace(/\D/g, '')
     .replace(/(\d{3})(\d)/, '$1.$2')
     .replace(/(\d{3})(\d)/, '$1.$2')
     .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function cpfValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }
 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }
 const regex = /^(?:\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{11})$/;
 const valid = regex.test(value);
 return {
  valid,
  value: valid ? value : undefined,
  message: valid ? 'Valid CPF.' : 'Please enter a valid cpf number.',
 };
}

export function nameValidator({ value, min = 2 }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }

 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }

 const valid = value.length >= min;
 return {
  valid,
  value: valid ? value : undefined,
  message: valid ? 'Valid name.' : 'Name must be at least 2 characters long.',
 };
}

export function genderValidator({ value }: ValidatorParams): ValidatorMessage {
 if (!value) {
  return REQUIRED_FIELD;
 }

 if (typeof value !== 'string') {
  return INVALID_TYPE;
 }

 const valid =
     value.toUpperCase() === EGender.MALE ||
     value.toUpperCase() === EGender.FEMALE ||
     value.toUpperCase() === EGender.OTHER;

 return {
  valid,
  value: valid ? value : undefined,
  message: valid ? 'Valid gender.' : 'Invalid Gender.',
 };
}