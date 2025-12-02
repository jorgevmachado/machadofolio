import { type Nest } from '../../../api';
import { BaseService } from '../../../shared';

import Supplier from '../supplier';
import { type CreateSupplierParams, type UpdateSupplierParams } from '../types';

export class SupplierService extends BaseService<Supplier, CreateSupplierParams, UpdateSupplierParams> {
    constructor(private nest: Nest) {
        super(nest.finance.supplier, (response) => new Supplier(response));
    }
}