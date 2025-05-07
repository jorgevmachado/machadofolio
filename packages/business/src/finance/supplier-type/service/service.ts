import { BaseService } from '../../../shared';

import { type Nest } from '../../../api';

import type { CreateSupplierTypeParams, UpdateSupplierTypeParams } from '../types';
import SupplierType from '../supplier-type';

export class SupplierTypeService extends BaseService<SupplierType, CreateSupplierTypeParams, UpdateSupplierTypeParams>{
    constructor(private nest: Nest) {
        super(nest.finance.supplier.type, (response) => new SupplierType(response));
    }
}