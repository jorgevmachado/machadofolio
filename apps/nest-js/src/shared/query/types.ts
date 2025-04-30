import { type ObjectLiteral, type Repository } from 'typeorm';

import type { QueryParameters } from '@repo/business/types';

import type { TBy } from '../types';

export type TQueryCondition =
    | '='
    | '>'
    | '<'
    | '>='
    | '<='
    | 'LIKE'
    | 'IN'
    | 'NOT IN'
    | 'IS NULL'
    | 'IS NOT NULL'
    | 'AND'
    | 'OR'
    | 'NOT';

export type FilterParams  ={
    value: string | number;
    param: string;
    relation?: boolean;
    condition: TQueryCondition;
}

export type SearchParams = {
    by: TBy;
    value: string | number;
    condition?: TQueryCondition;
}

export type WhereParams = Omit<SearchParams, 'by'> & {
    by: string;
    relation?: boolean;
}
export type QueryParams<T extends ObjectLiteral> = {
    readonly alias: string;
    readonly filters?: Array<FilterParams>;
    readonly relations?: Array<string>;
    readonly defaultAsc?: string;
    readonly parameters?: QueryParameters;
    readonly repository: Repository<T>;
    readonly withDeleted?: boolean;
    readonly searchParams?: SearchParams;
    readonly withRelations?: boolean;
}