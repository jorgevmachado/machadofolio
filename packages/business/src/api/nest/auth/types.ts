import { type EGender } from '@repo/services';

import { type ERole, type EStatus } from '../../../enum';

import { type IFinance } from '../finance';
import type { ITrainer } from '../pokemon';
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
    pokemon_trainer?: ITrainer
    confirmation_token?: string;
    total_authentications: number;
    last_authentication_at?: Date;
    authentication_success: number;
    authentication_failures: number;
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
    | 'total_authentications'
    | 'last_authentication_at'
    | 'authentication_success'
    | 'authentication_failures'
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
