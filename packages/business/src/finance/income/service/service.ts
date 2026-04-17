import type { Nest } from '../../../api';
import { BaseService } from '../../../shared';

import Income from '../income';
import type { CreateIncomeParams, UpdateIncomeParams } from '../types';

export class IncomeService extends BaseService<Income, CreateIncomeParams, UpdateIncomeParams> {
    constructor(private nest: Nest) {
        super(nest.finance.income, (response) => new Income(response));
    }
}