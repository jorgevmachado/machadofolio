import { EBillType } from '@repo/business';

import { type Bill } from '../finance/entities/bill.entity';

import { BANK_MOCK } from './bank.mock';
import { EXPENSE_MOCK } from './expense.mock';
import { FINANCE_MOCK } from './finance.mock';
import { GROUP_MOCK } from './group.mock';

export const  BILL_MOCK: Bill = {
    id: '4245135e-0e58-48fc-8fd2-9353d0f56c34',
    year: 2025,
    bank: BANK_MOCK,
    type: EBillType.BANK_SLIP,
    name: "Bill Bank Slip",
    total: 1200,
    group: GROUP_MOCK,
    finance: FINANCE_MOCK,
    name_code: "bill_bank_slip",
    all_paid: true,
    total_paid: 200,
    expenses: [ EXPENSE_MOCK ],
    created_at: new Date('2025-04-02T19:11:59.385Z'),
    updated_at: new Date('2025-04-02T19:11:59.385Z'),
};