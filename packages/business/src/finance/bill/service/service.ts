import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import type { CreateBillParams, UpdateBillParams } from '../types';
import Bill from '../bill';

export class BillService extends BaseService<Bill, CreateBillParams, UpdateBillParams>{
    constructor(private nest: Nest) {
        super(nest.finance.bill, (response) => new Bill(response));
    }
}