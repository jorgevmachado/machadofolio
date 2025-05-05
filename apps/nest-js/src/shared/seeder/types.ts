import type { TByParam } from '../types';
import type { ValidateKey } from '../validate';

export type SeedEntityParams<T> = {
    by: TByParam;
    seed: T;
    label: string;
    withReturnSeed?: boolean;
    createdEntityFn: (entity: T) => Promise<T>;
}

export type SeedEntitiesParams<T> = Omit<SeedEntityParams<T>, 'seed'> & {
    key: ValidateKey;
    seeds: Array<T>;
}

export type ExecuteSeedParams<T> = {
    label: string;
    seedMethod: () => Promise<Array<T | void>>;
};