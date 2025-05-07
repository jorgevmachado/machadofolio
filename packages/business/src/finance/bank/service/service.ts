import { type INestBaseResponse, type Nest } from '../../../api';
import { type Paginate } from '../../../paginate';
import { type QueryParameters } from '../../../types';

import type { CreateBankParams, UpdateBankParams } from '../types';
import Bank from '../bank';

export class BankService {
    constructor(private nest: Nest) {}

    public async create(params: CreateBankParams): Promise<Bank> {
        return await this.nest.finance.bank
            .create(params)
            .then((response) => new Bank(response));
    }

    public async update(param: string, params: UpdateBankParams): Promise<Bank> {
        return await this.nest.finance.bank
            .update(param, params)
            .then((response) => new Bank(response));
    }

    public async getAll(
        parameters: QueryParameters,
    ): Promise<Array<Bank> | Paginate<Bank>> {
        return await this.nest.finance.bank.getAll(parameters).then((response) => {
            if (Array.isArray(response)) {
                return response.map((result) => new Bank(result));
            }
            const responsePaginate = response as Paginate<Bank>;
            return {
                ...responsePaginate,
                results: responsePaginate.results.map((result) => new Bank(result)),
            };
        });
    }

    public async get(param: string): Promise<Bank> {
        return await this.nest.finance.bank
            .getOne(param)
            .then((response) => new Bank(response));
    }

    public async remove(param: string): Promise<INestBaseResponse> {
        return await this.nest.finance.bank.delete(param);
    }
}