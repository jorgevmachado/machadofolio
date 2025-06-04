import { EExpenseType } from '../../../api';

import { SUPPLIER_MOCK } from '../../supplier';

import type { ExpenseEntity } from '../types';

import { BILL_MOCK } from '../../bill';

export const EXPENSE_MOCK: ExpenseEntity = {
    id: 'e8ff59cb-6702-43f3-9a08-1f1c68324eac',
    name: 'Personal Physical Credit Card Porto Vivo',
    year: 2025,
    bill: BILL_MOCK,
    type: EExpenseType.VARIABLE,
    paid: false,
    total: 100,
    supplier: SUPPLIER_MOCK,
    name_code: 'personal_physical_credit_card_porto_vivo',
    total_paid: 0,
    january: 100,
    january_paid: true,
    february: 0,
    february_paid: true,
    march: 0,
    march_paid: true,
    april: 0,
    april_paid: true,
    may: 0,
    may_paid: true,
    june: 0,
    june_paid: true,
    july: 0,
    july_paid: true,
    august: 0,
    august_paid: true,
    september: 0,
    september_paid: true,
    october: 0,
    october_paid: true,
    november: 0,
    november_paid: true,
    december: 0,
    december_paid: true,
    description: undefined,
    instalment_number: 1,
    created_at: new Date('2025-01-01T17:37:47.783Z'),
    updated_at: new Date('2025-01-01T14:40:31.207Z'),
    deleted_at: undefined,
    is_aggregate: false,
    parent: undefined,
    children: undefined,
};