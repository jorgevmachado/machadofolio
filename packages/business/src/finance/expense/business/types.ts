import { EMonth } from '@repo/services';

import { type PersistMonthParams } from '../../month';

import { ExpenseEntity } from '../types';

export type PrepareForCreationParams = {
    value?: number;
    month?: EMonth;
    months?: Array<PersistMonthParams>;
    expense: ExpenseEntity;
}

export type PrepareForCreationResult = {
    nextYear: number;
    requiresNewBill: boolean;
    monthsForNextYear?: Array<PersistMonthParams>;
    expenseForNextYear?: ExpenseEntity;
    monthsForCurrentYear: Array<PersistMonthParams>;
    expenseForCurrentYear: ExpenseEntity;
    instalmentForNextYear: number;
}