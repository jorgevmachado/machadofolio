import type { BillEntity } from '../types';
import { EBillType } from '../../../api';

import { BANK_MOCK } from '../../bank';
import { FINANCE_MOCK } from '../../mock';
import { GROUP_MOCK } from '../../group';

export const BILL_MOCK: BillEntity = {
    id: '3f5bf099-4c3b-4ee2-a21f-7d7ccd66d13c',
    year: 2025,
    bank: BANK_MOCK,
    type: EBillType.CREDIT_CARD,
    name: 'Personal Credit Card Porto',
    total: 0,
    group: GROUP_MOCK,
    finance: FINANCE_MOCK,
    all_paid: false,
    name_code: 'personal_credit_card_porto',
    total_paid: 0,
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined
};