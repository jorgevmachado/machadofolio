export type INestConfig = {
    token?: string;
    baseUrl: string;
}

export type INestModuleConfig = Pick<INestConfig, 'baseUrl'> & {
    headers: Record<string, string>;
}

export type INestBaseEntity = {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export type IPartialNestBaseEntity = Partial<INestBaseEntity>;

export type INestBaseResponse = {
    message: string;
}