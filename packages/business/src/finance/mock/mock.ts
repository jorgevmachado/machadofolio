const FINANCE_MOCK = {
    id: '493de6c1-ec4b-48a7-9169-c8ba750798ce',
    user: {
        id: 'eaca4c08-e62d-495a-ae1c-918199da8d52',
        cpf: '49892120450',
        name: 'John Doe',
        email: 'john.doe@mail.com',
        gender: 'MALE',
        whatsapp: '11998765432',
        created_at: new Date('2024-09-09T00:00:00.000Z'),
        updated_at: new Date('2024-09-09T00:00:00.000Z'),
        date_of_birth: new Date('1990-01-01T00:00:00.000Z'),
    },
    bills: [],
    groups: [],
    incomes: [],
    created_at: new Date('2025-02-01T17:37:47.783Z'),
    updated_at: new Date('2025-02-01T14:40:31.207Z'),
    deleted_at: undefined,
};

const GROUP_MOCK = {
    id: '41437bff-2d77-4985-8a14-fa7643f9249b',
    name: 'Personal',
    finance: FINANCE_MOCK,
    name_code: 'personal',
    created_at: new Date('2025-02-04T19:00:18.687Z'),
    updated_at: new Date('2025-02-04T19:00:18.687Z')
};

const BANK_MOCK = {
    id: 'dfea3644-1e51-4c59-9456-64ced7d13873',
    name: 'Nubank',
    name_code: 'nubank',
    created_at: new Date('2025-02-01T19:46:54.072Z'),
    updated_at: new Date('2025-02-01T19:46:54.072Z'),
    deleted_at: undefined,
};

const INCOME_SOURCE_MOCK = {
    id: 'a4d9d7bf-6525-4909-9fc9-af916b76b3fa',
    name: 'Job',
    name_code: 'job',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z')
}

const INCOME_MOCK = {
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
    income: INCOME_MOCK,
    expense: undefined,
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined,
    received_at: new Date('2025-02-01T19:00:18.670Z'),
}

INCOME_MOCK.months = [INCOME_MONTH_MOCK];

const SUPPLIER_TYPE_MOCK = {
    id: 'afdb7bc2-78ad-459c-9d1f-27b99e38f954',
    name: 'Bills',
    name_code: 'bills',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z')
};

const SUPPLIER_TYPE_CHILDREN_MOCK = {
    id: '8df2ee99-cfce-435a-9df0-efd533d825b7',
    name: 'Housing',
    name_code: 'housing',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z')
};

const SUPPLIER_MOCK = {
    id: '0bb31bd2-843c-4b8e-9521-4f22607c3a04',
    name: 'Digital Wallet',
    type: SUPPLIER_TYPE_MOCK,
    name_code: 'digital_wallet',
    created_at: new Date('2025-04-02T19:11:59.333Z'),
    updated_at: new Date('2025-04-02T19:11:59.333Z'),
    deleted_at: undefined
};

const SUPPLIER_CHILDREN_MOCK = {
    id: '9c8a8264-a5e0-4e36-94c3-cf5f8df66a8d',
    name: 'Pão de Açucar',
    type: SUPPLIER_TYPE_CHILDREN_MOCK,
    name_code: 'pao_de_acucar',
    created_at: new Date('2025-04-02T19:11:59.333Z'),
    updated_at: new Date('2025-04-02T19:11:59.333Z'),
    deleted_at: undefined
};

const BILL_MOCK = {
    id: '700afabc-fa96-4c7a-b06d-c3556cc2bc31',
    year: 2025,
    bank: BANK_MOCK,
    type: 'CREDIT_CARD',
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

const CHILDREN_EXPENSE_MOCK = {
    id: 'f27cd92b-262b-40bd-b8dd-eb671e5ef6a1',
    name: 'Personal Credit Card Nubank Digital Wallet Pão de Açucar',
    year: 2025,
    bill: BILL_MOCK,
    type: 'VARIABLE',
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

const EXPENSE_MOCK = {
    id: '2c4213af-bd6f-446a-b64e-5d7f7e9580a8',
    name: 'Personal Credit Card Nubank Digital Wallet',
    year: 2025,
    bill: BILL_MOCK,
    type: 'VARIABLE',
    paid: false,
    total: 100,
    months: undefined,
    supplier: SUPPLIER_MOCK,
    name_code: 'personal_credit_card_nubank_digital_wallet',
    total_paid: 0,
    description: undefined,
    instalment_number: 1,
    created_at: new Date('2025-01-01T17:37:47.783Z'),
    updated_at: new Date('2025-01-01T14:40:31.207Z'),
    deleted_at: undefined,
    is_aggregate: false,
    parent: undefined,
    children: undefined,
};

const EXPENSE_PARENT_MOCK = {
    ...EXPENSE_MOCK,
    children: [
        CHILDREN_EXPENSE_MOCK
    ]
};

const EXPENSE_CHILDREN_MOCK = {
    ...CHILDREN_EXPENSE_MOCK,
    parent: EXPENSE_PARENT_MOCK,
};

const EXPENSE_MONTH_MOCK = {
    id: 'f101e932-8cb4-4c05-9c76-12ccb51a55ed',
    year: 2025,
    code: 1,
    paid: false,
    value: 100,
    label: 'january',
    income: undefined,
    expense: EXPENSE_MOCK,
    created_at: new Date('2025-04-02T19:11:59.405Z'),
    updated_at: new Date('2025-04-02T19:11:59.405Z'),
    deleted_at: undefined,
    received_at: undefined,
}

EXPENSE_MOCK.months = [EXPENSE_MONTH_MOCK];

FINANCE_MOCK.bills.push(BILL_MOCK);
FINANCE_MOCK.groups.push(GROUP_MOCK);
FINANCE_MOCK.incomes.push(INCOME_MOCK);

export {
    FINANCE_MOCK,
    GROUP_MOCK,
    BANK_MOCK,
    BILL_MOCK,
    INCOME_MOCK,
    INCOME_SOURCE_MOCK,
    SUPPLIER_TYPE_MOCK,
    SUPPLIER_TYPE_CHILDREN_MOCK,
    SUPPLIER_MOCK,
    SUPPLIER_CHILDREN_MOCK,
    EXPENSE_MOCK,
    EXPENSE_PARENT_MOCK,
    EXPENSE_CHILDREN_MOCK,
    EXPENSE_MONTH_MOCK,
    INCOME_MONTH_MOCK
};