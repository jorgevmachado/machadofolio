import { type Supplier } from '../entities/supplier.entity';

import { SUPPLIER_TYPE_MOCK } from './supplier-type.mock';

export const SUPPLIER_MOCK: Supplier = {
    id: '20b2d8d3-4484-4a24-88a5-dc41e05088cb',
    name: 'Supplier',
    type: SUPPLIER_TYPE_MOCK,
    name_code: 'supplier',
    created_at: new Date('2025-02-01T19:00:18.670Z'),
    updated_at: new Date('2025-02-01T19:00:18.670Z')
}