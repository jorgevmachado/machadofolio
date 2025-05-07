import type { Nest } from '../../../api';
import type { Paginate } from '../../../paginate';
import type { QueryParameters } from '../../../types';

import type { CreateBillParams, UpdateBillParams } from '../types';
import Bill from '../bill';

export class BillService {
    constructor(private nest: Nest) {}

    public async getAll(parameters: QueryParameters): Promise<Array<Bill> | Paginate<Bill>>  {
        return this.nest.finance.bill.getAll(parameters).then((response) => {
            if (Array.isArray(response)) {
                return response.map((bill) => new Bill(bill));
            }
            const responsePaginate = response as Paginate<Bill>;
            return {
                ...responsePaginate,
                results: responsePaginate.results.map((bill) => new Bill(bill)),
            };
        });
    }

    public async create(params: CreateBillParams): Promise<Bill> {
        return await this.nest.finance.bill
            .create(params)
            .then((response) => new Bill(response));
    }

    public async update(
        param: string,
        params: UpdateBillParams,
    ): Promise<Bill> {
        return await this.nest.finance.bill
            .update(param, params)
            .then((response) => new Bill(response));
    }
}