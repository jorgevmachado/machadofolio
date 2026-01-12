import type { IPartialNestBaseEntity, ISignInParams, ISignUpParams, IUpdateUserParams, IUser } from '../api';

export type UserEntity = IUser;

export type TUser = Omit<IUser, 'salt' | 'recover_token' | 'confirmation_token'>;

export type SignUpParams = ISignUpParams;

export type SignInParams = ISignInParams;

export type UpdateParams = IUpdateUserParams;

export type UserConstructorParams = Omit<UserEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'total_authentications' | 'last_authentication_at' | 'authentication_success' | 'authentication_failures'> & IPartialNestBaseEntity & {
    clean?: boolean;
    cleanAllFormatter?: boolean;
    total_authentications?: number;
    last_authentication_at?: Date;
    authentication_success?: number;
    authentication_failures?: number;
};

export type ValidateCurrentUserParams =  {
    id?: UserEntity['id'];
    role?: UserEntity['role'];
    status?: UserEntity['status'];
    authUser: UserEntity;
    validateAdmin?: boolean;
}