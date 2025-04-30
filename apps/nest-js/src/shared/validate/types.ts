export type ValidateKey = 'id' | 'name' | 'all';

export type ValidateListMockParams<T> = {
    key: ValidateKey;
    list: Array<T>;
    label: string;
}