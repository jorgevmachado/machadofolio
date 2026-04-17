import { type EGender } from '@repo/services';

import { type ERole, type EStatus } from '../../../enum';

import { type IFinance } from '../finance';
import { type INestBaseEntity } from '../types';

export type IUser = INestBaseEntity & {
    cpf: string;
    role?: ERole;
    salt?: string;
    name: string;
    email: string;
    gender: EGender;
    status?: EStatus;
    avatar?: string;
    finance?: IFinance;
    whatsapp: string;
    password?: string;
    date_of_birth: Date;
    recover_token?: string;
    confirmation_token?: string;
}

export type ISignUpParams
    = Omit<
    IUser,
    | 'id'
    | 'role'
    | 'status'
    | 'password'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
> & {
    password: string;
    password_confirmation: string;
}

export type ISignInParams = Pick<IUser, 'email'> &{
    password: string;
}

export type IUpdateUserParams = Partial<Pick<
    IUser,
    | 'id'
    | 'role'
    | 'name'
    | 'gender'
    | 'status'
    | 'date_of_birth'
>>;
