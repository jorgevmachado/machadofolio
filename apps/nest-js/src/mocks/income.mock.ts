import { FINANCE_MOCK } from './finance.mock';
import { INCOME_SOURCE_MOCK } from './income-source.mock';

const MOCK = {
    id: '7360e3be-20a7-4814-866e-fff660ce9d8e',
    year: 2025,
    name: 'Salary',
    total: 100,
    months: [],
    source: INCOME_SOURCE_MOCK,
    finance: FINANCE_MOCK,
    name_code: 'salary',
    received_at: new Date('2025-02-01T19:00:18.670Z'),
}

const INCOME_MONTH_MOCK = {
    id: 'a54df7b0-e28b-4d35-a658-edbb35fcb2d0',
    year: 2025,
    code: 1,
    paid: false,
    value: 100,
    label: 'january',
    income: MOCK,
    expense: undefined,
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined,
    received_at: new Date('2025-02-01T19:00:18.670Z'),
}

const INCOME_MOCK = {
    id: '7360e3be-20a7-4814-866e-fff660ce9d8e',
    year: 2025,
    name: 'Salary',
    total: 100,
    months: [INCOME_MONTH_MOCK],
    source: INCOME_SOURCE_MOCK,
    finance: FINANCE_MOCK,
    name_code: 'salary',
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined,
    received_at: new Date('2025-02-01T19:00:18.670Z'),
}

export {
    INCOME_MOCK,
    INCOME_MONTH_MOCK
}