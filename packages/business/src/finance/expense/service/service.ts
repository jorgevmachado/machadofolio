import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import type { ExpenseCreateParams, ExpenseUpdateParams } from '../types';
import Expense from '../expense';

export class ExpenseService extends BaseService<Expense, ExpenseCreateParams, ExpenseUpdateParams>{
    constructor(private nest: Nest) {
        super(nest.finance.bill.expense, (response) => new Expense(response));
    }
}