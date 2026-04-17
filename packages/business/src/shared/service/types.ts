import type { IBaseResponse } from '../../api';
import type { Paginate } from '../../paginate';
import type { QueryParameters } from '../../types';

export type ApiModule<T, CP, UP> = {
    getAll: (parameters: QueryParameters, by?: string) => Promise<Paginate<T> | Array<T>>;
    getOne: (param: string, by?: string) => Promise<T>;
    create: (params: CP, by?: string) => Promise<T>;
    update: (param: string, params: UP, by?: string) => Promise<T>;
    delete: (param: string, by?: string) => Promise<IBaseResponse>;
};