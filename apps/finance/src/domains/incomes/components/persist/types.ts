import { type Income } from '@repo/business';

import type { ValidatorMessage } from '@repo/services';

import { type InputProps } from '../../../../shared';

type TPersistInput =
  | 'id'
  | 'name'
  | 'source'
  | 'january'
  | 'january_paid'
  | 'february'
  | 'february_paid'
  | 'march'
  | 'march_paid'
  | 'april'
  | 'april_paid'
  | 'may'
  | 'may_paid'
  | 'june'
  | 'june_paid'
  | 'july'
  | 'july_paid'
  | 'august'
  | 'august_paid'
  | 'september'
  | 'september_paid'
  | 'october'
  | 'october_paid'
  | 'november'
  | 'november_paid'
  | 'december'
  | 'december_paid';

export type PersistForm = {
  valid: boolean;
  fields: Record<TPersistInput ,string | undefined>;
  errors: Record<TPersistInput ,ValidatorMessage | undefined>;
  message?: string;
}

export type CurrentValueParams = {
  type: InputProps['type'];
  name?: string;
  item?: Income;
}