import { SUPPLIER_TYPE_CHILDREN_MOCK, SUPPLIER_TYPE_MOCK } from '../../supplier-type';

import type { SupplierEntity } from '../types';

export const SUPPLIER_MOCK: SupplierEntity = {
    id: '0bb31bd2-843c-4b8e-9521-4f22607c3a04',
    name: 'Digital Wallet',
    type: SUPPLIER_TYPE_MOCK,
    name_code: 'digital_wallet',
    created_at: new Date('2025-04-02T19:11:59.333Z'),
    updated_at: new Date('2025-04-02T19:11:59.333Z'),
    deleted_at: undefined
};

export const SUPPLIER_CHILDREN_MOCK: SupplierEntity = {
    id: '9c8a8264-a5e0-4e36-94c3-cf5f8df66a8d',
    name: 'Pão de Açucar',
    type: SUPPLIER_TYPE_CHILDREN_MOCK,
    name_code: 'pao_de_acucar',
    created_at: new Date('2025-04-02T19:11:59.333Z'),
    updated_at: new Date('2025-04-02T19:11:59.333Z'),
    deleted_at: undefined
};