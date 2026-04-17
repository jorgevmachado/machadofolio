import type { TColors } from '@repo/ds';

export type ItemCalculationSummary = {
  key: string;
  label: string;
  value: {
    label: string | number;
    color?: TColors;
  }
}