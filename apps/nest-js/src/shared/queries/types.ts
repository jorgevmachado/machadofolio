import type { QueryParameters } from '@repo/business/types';

import type { FilterParams, SearchParams } from '../query';

export type FindOneByParams = Omit<FindByParams, 'searchParams'> & {
    value: string;
}

export type ListParams = {
    filters?: Array<FilterParams>;
    relations?: Array<string>;
    defaultAsc?: string;
    parameters?: QueryParameters;
    withDeleted?: boolean;
    withRelations?: boolean;
}

export type FindByParams = Pick<ListParams, 'filters' | 'withDeleted' | 'withRelations'> & {
    withThrow?: boolean;
    relations?: Array<string>;
    searchParams: SearchParams;
}

export type FindOneByOrder<T, R>  ={
    order: number;
    response?: R;
    complete?: boolean;
    withThrow?: boolean;
    completingData?: (result: T, response: R | T) => Promise<T>;
}
