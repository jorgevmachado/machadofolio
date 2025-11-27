import { BaseService } from '../../../shared';

import type { Nest } from '../../../api';

import type { CreateExpenseParams, UpdateExpenseParams, UploadsExpenseParams } from '../types';
import Expense from '../expense';
import { QueryParameters } from '../../../types';
import { Paginate } from '../../../paginate';

export class ExpenseService extends BaseService<Expense, CreateExpenseParams, UpdateExpenseParams> {
    constructor(private nest: Nest) {
        super(nest.finance.bill.expense, (response) => new Expense(response));
    }

    async getAllByBill(billId: string, parameters: QueryParameters): Promise<Paginate<Expense> | Array<Expense>> {
        return await this
            .nest
            .finance
            .bill
            .expense
            .getAllByBill(billId, parameters)
            .then((response) => {
                if (Array.isArray(response)) {
                    return response.map((result) => new Expense(result));
                }
                const responsePaginate = response as Paginate<Expense>;
                return {
                    ...responsePaginate,
                    results: responsePaginate.results.map((result) => new Expense(result)),
                };
            });
    }

    async upload(billId: string, params: UploadsExpenseParams): Promise<Array<Expense>> {
        return await this.nest.finance.bill.expense.uploads(billId, params).then((response) => {
            const expenses = response as unknown as Array<Expense>;
            return expenses.map((result) => new Expense(result))
        });
    }

}