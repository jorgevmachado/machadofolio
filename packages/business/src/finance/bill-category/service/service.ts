import { BaseService } from '../../../shared';

import { type Nest } from '../../../api';

import type { CreateBillCategoryParams, UpdateBillCategoryParams } from '../types';
import BillCategory from '../bill-category';


export class BillCategoryService extends BaseService<BillCategory, CreateBillCategoryParams, UpdateBillCategoryParams>{
    constructor(private nest: Nest) {
        super(nest.finance.billCategory, (response) => new BillCategory(response));
    }
}