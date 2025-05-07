import type { IBaseResponse } from '../../api';
import type { Paginate } from '../../paginate';
import type { QueryParameters } from '../../types';

import type { ApiModule } from './types';

export abstract class BaseService<T, CP, UP> {
    protected constructor(
        protected api: ApiModule<T, CP, UP>,
        protected transformResponse: (response: T) => T
    ) {}

    public async create(params: CP, by?: string): Promise<T> {
        return await this
            .api
            .create(params, by)
            .then((response) => this.transformResponse(response));
    }

    public async update(param: string, params: UP, by?: string): Promise<T> {
        return await this
            .api
            .update(param, params, by)
            .then((response) => this.transformResponse(response));
    }

    public async getAll(parameters: QueryParameters, by?: string): Promise<Paginate<T> | Array<T>> {
        return await this
            .api
            .getAll(parameters, by)
            .then((response) => {
                if (Array.isArray(response)) {
                    return response.map((result) => this.transformResponse(result));
                }
                const responsePaginate = response as Paginate<T>;
                return {
                    ...responsePaginate,
                    results: responsePaginate.results.map((result) => this.transformResponse(result)),
                };
            });
    }

    public async get(param: string, by?: string): Promise<T> {
        return await this
            .api
            .getOne(param, by)
            .then((response) => this.transformResponse(response));
    }

    public async remove(param: string, by?: string): Promise<IBaseResponse>  {
        return await this.api.delete(param, by);
    }

}