import { type Expense } from '../finance/entities/expense.entity';

import { EExpenseType } from '@repo/business';

import { BILL_MOCK } from './bill.mock';
import { SUPPLIER_MOCK } from './supplier.mock';

export const EXPENSE_MOCK: Expense = {
    id: 'e8ff59cb-6702-43f3-9a08-1f1c68324eac',
    name: 'Bill Bank Slip Supplier',
    year: 2025,
    bill: BILL_MOCK,
    type: EExpenseType.VARIABLE,
    paid: true,
    total: 1200,
    months: [],
    supplier: SUPPLIER_MOCK,
    name_code: 'bill_bank_slip_supplier',
    total_paid: 200,
    description: undefined,
    instalment_number: 1,
    created_at: new Date('2025-01-01T17:37:47.783Z'),
    updated_at: new Date('2025-01-01T14:40:31.207Z'),
    deleted_at: undefined
}