import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import type { CreateExpenseParams, UpdateExpenseParams } from '../types';
import Expense from '../expense';

export class ExpenseService extends BaseService<Expense, CreateExpenseParams, UpdateExpenseParams>{
    constructor(private nest: Nest) {
        super(nest.finance.bill.expense, (response) => new Expense(response));
    }
}