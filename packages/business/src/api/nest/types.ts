import type { IBaseEntity, IPartialBaseEntity } from '../types';

export type INestConfig = {
    token?: string;
    baseUrl: string;
}

export type INestModuleConfig = Pick<INestConfig, 'baseUrl'> & {
    headers: Record<string, string>;
}

export type INestBaseEntity = IBaseEntity;

export type IPartialNestBaseEntity = IPartialBaseEntity