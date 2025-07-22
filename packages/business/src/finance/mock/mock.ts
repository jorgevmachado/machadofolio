import { USER_ENTITY_MOCK } from '../../auth';

import { type BillEntity, EBillType } from '../bill';
import type { BankEntity } from '../bank';
import type { ExpenseEntity } from '../expense';
import type { FinanceEntity } from '../types';
import type { GroupEntity } from '../group';
import type { SupplierEntity } from '../supplier';
import type { SupplierTypeEntity } from '../supplier-type';

import { EExpenseType } from '../../api';

const FINANCE_MOCK: FinanceEntity = {
    id: '493de6c1-ec4b-48a7-9169-c8ba750798ce',
    user: USER_ENTITY_MOCK,
    bills: [],
    groups: [],
    created_at: new Date('2025-02-01T17:37:47.783Z'),
    updated_at: new Date('2025-02-01T14:40:31.207Z'),
    deleted_at: undefined,
};

const GROUP_MOCK: GroupEntity = {
    id: '41437bff-2d77-4985-8a14-fa7643f9249b',
    name: 'Personal',
    finance: FINANCE_MOCK,
    name_code: 'personal',
    created_at: new Date('2025-02-04T19:00:18.687Z'),
    updated_at: new Date('2025-02-04T19:00:18.687Z')
};

const BANK_MOCK: BankEntity = {
    id: 'dfea3644-1e51-4c59-9456-64ced7d13873',
    name: 'Nubank',
    name_code: 'nubank',
    created_at: new Date('2025-02-01T19:46:54.072Z'),
    updated_at: new Date('2025-02-01T19:46:54.072Z'),
    deleted_at: undefined,
};

const SUPPLIER_TYPE_MOCK: SupplierTypeEntity = {
    id: 'afdb7bc2-78ad-459c-9d1f-27b99e38f954',
    name: 'Bills',
    name_code: 'bills',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z')
};

const SUPPLIER_TYPE_CHILDREN_MOCK: SupplierTypeEntity = {
    id: '8df2ee99-cfce-435a-9df0-efd533d825b7',
    name: 'Housing',
    name_code: 'housing',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z')
};

const SUPPLIER_MOCK: SupplierEntity = {
    id: '0bb31bd2-843c-4b8e-9521-4f22607c3a04',
    name: 'Digital Wallet',
    type: SUPPLIER_TYPE_MOCK,
    name_code: 'digital_wallet',
    created_at: new Date('2025-04-02T19:11:59.333Z'),
    updated_at: new Date('2025-04-02T19:11:59.333Z'),
    deleted_at: undefined
};

const SUPPLIER_CHILDREN_MOCK: SupplierEntity = {
    id: '9c8a8264-a5e0-4e36-94c3-cf5f8df66a8d',
    name: 'Pão de Açucar',
    type: SUPPLIER_TYPE_CHILDREN_MOCK,
    name_code: 'pao_de_acucar',
    created_at: new Date('2025-04-02T19:11:59.333Z'),
    updated_at: new Date('2025-04-02T19:11:59.333Z'),
    deleted_at: undefined
};

const BILL_MOCK: BillEntity = {
    id: '700afabc-fa96-4c7a-b06d-c3556cc2bc31',
    year: 2025,
    bank: BANK_MOCK,
    type: EBillType.CREDIT_CARD,
    name: 'Personal Credit Card Nubank',
    total: 0,
    group: GROUP_MOCK,
    finance: FINANCE_MOCK,
    all_paid: false,
    name_code: 'personal_credit_card_nubank',
    total_paid: 0,
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined
};

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

const EXPENSE_MOCK: ExpenseEntity = {
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

const EXPENSE_PARENT_MOCK: ExpenseEntity = {
    ...EXPENSE_MOCK,
    children: [
        CHILDREN_EXPENSE_MOCK
    ]
};

const EXPENSE_CHILDREN_MOCK: ExpenseEntity = {
    ...CHILDREN_EXPENSE_MOCK,
    parent: EXPENSE_PARENT_MOCK,
};

FINANCE_MOCK.bills.push(BILL_MOCK);
FINANCE_MOCK.groups.push(GROUP_MOCK);

export {
    FINANCE_MOCK,
    GROUP_MOCK,
    BANK_MOCK,
    BILL_MOCK,
    SUPPLIER_TYPE_MOCK,
    SUPPLIER_TYPE_CHILDREN_MOCK,
    SUPPLIER_MOCK,
    SUPPLIER_CHILDREN_MOCK,
    EXPENSE_MOCK,
    EXPENSE_PARENT_MOCK,
    EXPENSE_CHILDREN_MOCK
};