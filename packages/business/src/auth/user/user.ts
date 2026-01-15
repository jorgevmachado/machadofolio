import { cleanFormatter, mobileValidator } from '@repo/services';

import { ERole, EStatus } from '../../enum';

import type { UserConstructorParams, UserEntity } from '../types';

export default class User implements UserEntity {
    id!: UserEntity['id'];
    cpf!: UserEntity['cpf'];
    role?: UserEntity['role'] = ERole.USER;
    salt?: UserEntity['salt'];
    name!: UserEntity['name'];
    email!: UserEntity['email'];
    gender!: UserEntity['gender'];
    status?: UserEntity['status'] = EStatus.ACTIVE;
    avatar?: UserEntity['avatar'];
    trainer?: UserEntity['trainer'];
    finance?: UserEntity['finance'];
    whatsapp!: UserEntity['whatsapp'];
    password?: UserEntity['password'];
    created_at!: UserEntity['created_at'];
    updated_at!: UserEntity['updated_at'];
    deleted_at?: UserEntity['deleted_at'];
    date_of_birth!: UserEntity['date_of_birth'];
    recover_token?: UserEntity['recover_token'];
    confirmation_token?: UserEntity['confirmation_token'];
    total_authentications: UserEntity['total_authentications'] = 0;
    last_authentication_at?: UserEntity['last_authentication_at'];
    authentication_success: UserEntity['authentication_success'] = 0;
    authentication_failures: UserEntity['authentication_failures'] = 0;

    constructor(params?: UserConstructorParams) {
        if(params) {
            const { clean = false, cleanAllFormatter = true } = params;
            this.id = params?.id ?? this.id;
            this.cpf = cleanAllFormatter ? cleanFormatter(params?.cpf) : params?.cpf;
            this.role = params.role;
            this.name = params.name;
            this.email = params.email;
            this.gender = params.gender;
            this.status = params.status;
            this.avatar = params.avatar;
            this.trainer = params?.trainer ?? this.trainer;
            this.finance = params?.finance ?? this.finance;
            this.date_of_birth = params.date_of_birth;
            this.created_at = params.created_at ?? this.created_at;
            this.updated_at = params.updated_at ?? this.updated_at;
            this.deleted_at = params.deleted_at ?? this.deleted_at;
            this.date_of_birth = params.date_of_birth;
            const whatsappToValidate = cleanFormatter(params.whatsapp);
            const validator = mobileValidator({ value: whatsappToValidate });
            if(!validator.valid) {
                throw new Error(validator.message);
            }
            this.whatsapp = cleanAllFormatter ? cleanFormatter(params.whatsapp) : params.whatsapp;

            this.total_authentications = params.total_authentications ?? this.total_authentications;
            this.last_authentication_at = params.last_authentication_at ?? this.last_authentication_at;
            this.authentication_success = params.authentication_success ?? this.authentication_success;
            this.authentication_failures = params.authentication_failures ?? this.authentication_failures;

            if (!clean) {
                this.salt = params.salt ?? this.salt;
                this.password = params.password ?? this.password;
                this.recover_token = params.recover_token ?? this.recover_token;
                this.confirmation_token = params.confirmation_token ?? this.confirmation_token;
            }
        }
    }
}