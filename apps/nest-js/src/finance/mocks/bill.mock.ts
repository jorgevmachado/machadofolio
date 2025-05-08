import { EBillType } from '@repo/business/finance/bill/enum';

import { type Bill } from '../entities/bill.entity';

import { BANK_MOCK } from './bank.mock';
import { BILL_CATEGORY_MOCK } from './bill-category.mock';
import { EXPENSE_MOCK } from './expense.mock';
import { FINANCE_MOCK } from './finance.mock';

export const  BILL_MOCK: Bill = {
    id: '4245135e-0e58-48fc-8fd2-9353d0f56c34',
    year: 2025,
    bank: BANK_MOCK,
    type: EBillType.BANK_SLIP,
    name: "Bill Bank Slip",
    total: 1200,
    finance: FINANCE_MOCK,
    name_code: "bill_bank_slip",
    all_paid: true,
    total_paid: 200,
    expenses: [ EXPENSE_MOCK ],
    category: BILL_CATEGORY_MOCK,
    created_at: new Date('2025-04-02T19:11:59.385Z'),
    updated_at: new Date('2025-04-02T19:11:59.385Z'),
};