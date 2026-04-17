import type { TByParam } from '../types';
import type { ValidateKey } from '../validate';

export type SeedEntityParams<T> = {
    by: TByParam;
    seed: T;
    label: string;
    withReturnSeed?: boolean;
    createdEntityFn: (entity: T) => Promise<T | undefined>;
}

export type SeedEntitiesParams<T> = Omit<SeedEntityParams<T>, 'seed'> & {
    key: ValidateKey;
    seeds?: Array<T>;
    seedsJson?: Array<unknown>;
}

export type ExecuteSeedParams<T> = {
    label: string;
    seedMethod: () => Promise<Array<T | void>>;
};

export interface GetRelationParams<T> {
    key: TByParam;
    list: Array<T>;
    param: string;
    relation: string;
}

export type CurrentSeedsParams<T> = {
    seeds?: Array<T>;
    seedsJson?: Array<unknown>;
}

export type SeedsResultItem = {
    list: number;
    added: number;
}

export interface SeedsGenerated<T> {
    list: Array<T>;
    added: Array<T>;
}

export interface PersistEntitySeedsParams<T> {
    staging: unknown;
    withSeed?: boolean;
    production: unknown;
    development: unknown;
    withRelations?: boolean;
    persistEntityFn?: (item: T) => T;
}

export interface GenerateEntitySeedsParams<T> {
    staging: unknown;
    seedsDir: string;
    withSeed?: boolean;
    production: unknown;
    development: unknown;
    withRelations?: boolean;
    filterGenerateEntityFn: (json: T, item: T) => boolean;
}