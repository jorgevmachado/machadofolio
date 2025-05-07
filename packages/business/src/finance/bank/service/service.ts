import { BaseService } from '../../../shared';

import { type Nest } from '../../../api';

import type { CreateBankParams, UpdateBankParams } from '../types';
import Bank from '../bank';

export class BankService extends BaseService<Bank, CreateBankParams, UpdateBankParams> {
    constructor(private nest: Nest) {
        super(nest.finance.bank, (response) => new Bank(response));
    }
}