import type { BillEntity } from '../types';
import { EBillType } from '../../../api';

import { BANK_MOCK } from '../../bank';
import { BILL_CATEGORY_MOCK } from '../../bill-category';
import { FINANCE_MOCK } from '../../mock';

export const BILL_MOCK: BillEntity = {
    id: '3f5bf099-4c3b-4ee2-a21f-7d7ccd66d13c',
    year: 2025,
    bank: BANK_MOCK,
    type: EBillType.CREDIT_CARD,
    name: 'Personal Physical Credit Card Porto',
    total: 2281.31,
    category: BILL_CATEGORY_MOCK,
    finance: FINANCE_MOCK,
    name_code: 'personal_physical_credit_card_porto',
    all_paid: false,
    total_paid: 1187.95,
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined
};