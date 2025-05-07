import { USER_ENTITY_MOCK } from '../../auth';

import { BILL_MOCK } from '../bill';
import type { FinanceEntity } from '../types';

export const FINANCE_MOCK: FinanceEntity = {
    id: '493de6c1-ec4b-48a7-9169-c8ba750798ce',
    user: USER_ENTITY_MOCK,
    bills: [
       BILL_MOCK,
    ],
    created_at: new Date('2025-02-01T17:37:47.783Z'),
    updated_at: new Date('2025-02-01T14:40:31.207Z'),
    deleted_at: undefined,
};