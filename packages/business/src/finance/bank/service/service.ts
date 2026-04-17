import { type Nest } from '../../../api';
import { BaseService } from '../../../shared';

import Bank from '../bank';
import type { CreateBankParams, UpdateBankParams } from '../types';

export class BankService extends BaseService<Bank, CreateBankParams, UpdateBankParams> {
    constructor(private nest: Nest) {
        super(nest.finance.bank, (response) => new Bank(response));
    }
}