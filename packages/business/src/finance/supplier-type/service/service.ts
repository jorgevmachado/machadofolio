import { type Nest } from '../../../api';
import { BaseService } from '../../../shared';

import SupplierType from '../supplier-type';
import type { CreateSupplierTypeParams, UpdateSupplierTypeParams } from '../types';

export class SupplierTypeService extends BaseService<SupplierType, CreateSupplierTypeParams, UpdateSupplierTypeParams>{
    constructor(private nest: Nest) {
        super(nest.finance.supplier.type, (response) => new SupplierType(response));
    }
}