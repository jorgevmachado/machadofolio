import { type INestBaseResponse, type Nest } from '../../../api';
import { type Paginate } from '../../../paginate';
import { type QueryParameters } from '../../../types';

import { type CreateBillCategoryParams, type UpdateBillCategoryParams } from '../types';
import BillCategory from '../bill-category';

export class BillCategoryService {
    constructor(private nest: Nest) {}

    public async create(params: CreateBillCategoryParams): Promise<BillCategory> {
        return await this.nest.finance.bill.category
            .create(params)
            .then((response) => new BillCategory(response));
    }

    public async update(
        param: string,
        params: UpdateBillCategoryParams,
    ): Promise<BillCategory> {
        return await this.nest.finance.bill.category
            .update(param, params)
            .then((response) => new BillCategory(response));
    }

    public async getAll(
        parameters: QueryParameters,
    ): Promise<Array<BillCategory> | Paginate<BillCategory>> {
        return await this.nest.finance.bill.category
            .getAll(parameters)
            .then((response) => {
                if (Array.isArray(response)) {
                    return response.map((result) => new BillCategory(result));
                }
                const responsePaginate = response as Paginate<BillCategory>;
                return {
                    ...responsePaginate,
                    results: responsePaginate.results.map(
                        (result) => new BillCategory(result),
                    ),
                };
            });
    }

    public async get(param: string): Promise<BillCategory> {
        return await this.nest.finance.bill.category
            .getOne(param)
            .then((response) => new BillCategory(response));
    }

    public async remove(param: string): Promise<INestBaseResponse> {
        return await this.nest.finance.bill.category.delete(param);
    }
}