import type { Nest } from '../../../api';
import { BaseService } from '../../../shared';

import Bill from '../bill';
import type {
  CreateBillParams ,
  UpdateBillParams ,
  UploadBillParams,
} from '../types';

export class BillService extends BaseService<Bill, CreateBillParams, UpdateBillParams> {
  constructor(private nest: Nest) {
    super(nest.finance.bill ,(response) => new Bill(response));
  }

  async upload(params: UploadBillParams): Promise<Array<Bill>> {
    return await this.nest.finance.bill.upload(params).then();
  }
}