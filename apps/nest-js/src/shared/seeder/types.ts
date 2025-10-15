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