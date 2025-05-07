import { BaseService } from '../../../shared';

import { type Nest } from '../../../api';

import { type CreateSupplierParams, type UpdateSupplierParams } from '../types';

import Supplier from '../supplier';


export class SupplierService extends BaseService<Supplier, CreateSupplierParams, UpdateSupplierParams> {
    constructor(private nest: Nest) {
        super(nest.finance.supplier, (response) => new Supplier(response));
    }
}