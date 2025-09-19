import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import type { CreateIncomeParams, UpdateIncomeParams } from '../types';

import Income from '../income';

export class IncomeService extends BaseService<Income, CreateIncomeParams, UpdateIncomeParams> {
    constructor(private nest: Nest) {
        super(nest.finance.income, (response) => new Income(response));
    }
}