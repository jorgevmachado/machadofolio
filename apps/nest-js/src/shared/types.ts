export type BasicEntity = {
    id: string;
    name?: string
};

export type TByParam = 'name' | 'id' | 'cpf' | 'order';

export type TBy =
    | 'id'
    | 'cpf'
    | 'order'
    | 'name'
    | 'email'
    | 'whatsapp'
    | 'accountId';



