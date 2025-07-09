import { EExpenseType } from '../../../api';

import { SUPPLIER_CHILDREN_MOCK, SUPPLIER_MOCK } from '../../supplier';

import type { ExpenseEntity } from '../types';

import { BILL_MOCK } from '../../bill';

const CHILDREN_EXPENSE_MOCK: ExpenseEntity = {
    id: 'f27cd92b-262b-40bd-b8dd-eb671e5ef6a1',
    name: 'Personal Credit Card Nubank Digital Wallet Pão de Açucar',
    year: 2025,
    bill: BILL_MOCK,
    type: EExpenseType.VARIABLE,
    paid: false,
    total: 0,
    supplier: SUPPLIER_CHILDREN_MOCK,
    name_code: 'personal_digital_wallet_credit_card_nubank_pao_de_acucar',
    total_paid: 0,
    january: 68.93,
    january_paid: true,
    february: 0,
    february_paid: true,
    march: 0,
    march_paid: false,
    april: 0,
    april_paid: false,
    may: 0,
    may_paid: false,
    june: 0,
    june_paid: false,
    july: 0,
    july_paid: false,
    august: 0,
    august_paid: false,
    september: 0,
    september_paid: false,
    october: 0,
    october_paid: false,
    november: 0,
    november_paid: false,
    december: 0,
    december_paid: false,
    description: undefined,
    instalment_number: 1,
    created_at: new Date('2025-01-01T17:37:47.783Z'),
    updated_at: new Date('2025-01-01T14:40:31.207Z'),
    deleted_at: undefined,
    parent: undefined,
    children: undefined,
    is_aggregate: true,
    aggregate_name: 'Digital Wallet'
};

export const EXPENSE_MOCK: ExpenseEntity = {
    id: '2c4213af-bd6f-446a-b64e-5d7f7e9580a8',
    name: 'Personal Credit Card Nubank Digital Wallet',
    year: 2025,
    bill: BILL_MOCK,
    type: EExpenseType.VARIABLE,
    paid: false,
    total: 100,
    supplier: SUPPLIER_MOCK,
    name_code: 'personal_credit_card_nubank_digital_wallet',
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

export const EXPENSE_PARENT_MOCK: ExpenseEntity = {
    ...EXPENSE_MOCK,
    children: [
        CHILDREN_EXPENSE_MOCK
    ]
};

export const EXPENSE_CHILDREN_MOCK: ExpenseEntity = {
    ...CHILDREN_EXPENSE_MOCK,
    parent: EXPENSE_PARENT_MOCK,
};