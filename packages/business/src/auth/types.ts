import type { IPartialNestBaseEntity, ISignInParams, ISignUpParams, IUpdateUserParams, IUser } from '../api';

export type UserEntity = IUser;

export type TUser = Omit<IUser, 'salt' | 'recover_token' | 'confirmation_token'>;

export type SignUpParams = ISignUpParams;

export type SignInParams = ISignInParams;

export type UpdateParams = IUpdateUserParams;

export type UserConstructorParams = Omit<UserEntity, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & IPartialNestBaseEntity & {
    clean?: boolean;
    cleanAllFormatter?: boolean;
};

export type ValidateCurrentUserParams =  {
    id?: UserEntity['id'];
    role?: UserEntity['role'];
    status?: UserEntity['status'];
    authUser: UserEntity;
    validateAdmin?: boolean;
}