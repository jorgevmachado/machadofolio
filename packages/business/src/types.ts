import { type ERole, type EStatus } from './api';

export interface QueryParameters {
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
