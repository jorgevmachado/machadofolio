import { type Nest } from '../../../api';
import { BaseService } from '../../../shared';

import IncomeSource from '../income-source';
import type { CreateIncomeSourceParams, UpdateIncomeSourceParams } from '../types';

export class IncomeSourceService extends BaseService<IncomeSource, CreateIncomeSourceParams, UpdateIncomeSourceParams>{
    constructor(private nest: Nest) {
        super(nest.finance.income.source, (response) => new IncomeSource(response));
    }
}