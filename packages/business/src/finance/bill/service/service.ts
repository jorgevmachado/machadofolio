import type { Nest } from '../../../api';
import { BaseService } from '../../../shared';

import Bill from '../bill';
import type { CreateBillParams, UpdateBillParams } from '../types';

export class BillService extends BaseService<Bill, CreateBillParams, UpdateBillParams>{
    constructor(private nest: Nest) {
        super(nest.finance.bill, (response) => new Bill(response));
    }
}