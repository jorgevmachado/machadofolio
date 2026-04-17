import { convertSubPathUrl,Http } from '@repo/services';

import { type Paginate } from '../../../paginate';
import type { IBaseResponse, IQueryParameters } from '../../types';

import type { INestModuleConfig } from '../types';

type NestModuleAbstractConstructorPrams = {
    pathUrl: string;
    subPathUrl?: string;
    nestModuleConfig: INestModuleConfig;
}

export abstract class NestModuleAbstract<T, CP, UP> extends Http {
    protected readonly pathUrl: string;
    protected readonly subPathUrl?: string;
    protected readonly nestModuleConfig: INestModuleConfig;

    protected constructor({ pathUrl, subPathUrl, nestModuleConfig }: NestModuleAbstractConstructorPrams) {
        const { baseUrl, headers } = nestModuleConfig;
        super(baseUrl, { headers });
        this.pathUrl = pathUrl;
        this.subPathUrl = subPathUrl;
        this.nestModuleConfig = nestModuleConfig;
    }

    public async getAll(parameters: IQueryParameters, by?: string): Promise<Paginate<T> | Array<T>> {
        const path = convertSubPathUrl({
            by,
            pathUrl: this.pathUrl,
            subPathUrl: this.subPathUrl,
            conectorPath: 'list'
        });
        return this.get(path, { params: parameters });
    }

    public async getOne(param: string, by?: string): Promise<T> {
        const path = convertSubPathUrl({
            by,
            pathUrl: this.pathUrl,
            isParam: true,
            subPathUrl: this.subPathUrl,
            conectorPath: param
        });
        return this.get(`${path}`);
    }

    public async delete(param: string, by?: string): Promise<IBaseResponse> {
        const path = convertSubPathUrl({
            by,
            pathUrl: this.pathUrl,
            isParam: true,
            subPathUrl: this.subPathUrl,
            conectorPath: param
        });
        return this.remove(`${path}`);
    }

    public async create(params: CP, by?: string): Promise<T> {
        const path = convertSubPathUrl({
            by,
            pathUrl: this.pathUrl,
            subPathUrl: this.subPathUrl,
        });
        return this.post(path, { body: params });
    }

    public async update(param: string, params: UP, by?: string): Promise<T> {
        const path = convertSubPathUrl({
            by,
            pathUrl: this.pathUrl,
            isParam: true,
            subPathUrl: this.subPathUrl,
            conectorPath: param
        });
        return this.path(`${path}`, { body: params });
    }

}