import { BaseService } from '../../../shared';

import { type Nest } from '../../../api';

import type { CreateIncomeSourceParams, UpdateIncomeSourceParams } from '../types';
import IncomeSource from '../income-source';

export class IncomeSourceService extends BaseService<IncomeSource, CreateIncomeSourceParams, UpdateIncomeSourceParams>{
    constructor(private nest: Nest) {
        super(nest.finance.income.source, (response) => new IncomeSource(response));
    }
}