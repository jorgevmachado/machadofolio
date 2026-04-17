import { type ERole, type EStatus } from '../enum';

export type IResponsePaginate<T> = {
    next: string;
    count: number;
    results: Array<T>;
    previous: string;
}

export type IQueryParameters = {
    all?: boolean;
    asc?: string;
    desc?: string;
    year?: string;
    page?: number;
    name?: string;
    role?: ERole;
    limit?: number;
    status?: EStatus;
    withDeleted?: boolean;
}

export type IBaseResponse = {
    message: string;
}

export type IBaseEntity = {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export type IPartialBaseEntity = Partial<IBaseEntity>;