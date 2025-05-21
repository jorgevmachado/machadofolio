import { type Group } from '../finance/entities/group.entity';

import { FINANCE_MOCK } from './finance.mock';

export const GROUP_MOCK: Group = {
    id: '66c25cf9-ddba-4591-810f-3b60911f47c1',
    name: 'Group',
    finance: FINANCE_MOCK,
    name_code: 'group',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z'),
};