import { type Expense } from '../finance/entities/expense.entity';

import { EExpenseType } from '@repo/business';

import { BILL_MOCK } from './bill.mock';
import { SUPPLIER_MOCK } from './supplier.mock';

export const EXPENSE_MOCK: Expense = {
    id: 'e8ff59cb-6702-43f3-9a08-1f1c68324eac',
    name: 'bill Bank Slip Supplier',
    year: 2025,
    bill: BILL_MOCK,
    type: EExpenseType.VARIABLE,
    paid: true,
    total: 1200,
    supplier: SUPPLIER_MOCK,
    name_code: 'bill_bank_slip_supplier',
    total_paid: 200,
    january: 100,
    january_paid: true,
    february: 100,
    february_paid: true,
    march: 100,
    march_paid: false,
    april: 100,
    april_paid: false,
    may: 100,
    may_paid: false,
    june: 100,
    june_paid: false,
    july: 100,
    july_paid: false,
    august: 100,
    august_paid: false,
    september: 100,
    september_paid: false,
    october: 100,
    october_paid: false,
    november: 100,
    november_paid: false,
    december: 100,
    december_paid: false,
    description: undefined,
    instalment_number: 1,
    created_at: new Date('2025-01-01T17:37:47.783Z'),
    updated_at: new Date('2025-01-01T14:40:31.207Z'),
    deleted_at: undefined
}