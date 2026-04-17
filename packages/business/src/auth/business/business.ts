import { Error,ERROR_STATUS_CODE } from '@repo/services';

import { ERole } from '../../enum';

import type { UserConstructorParams, UserEntity, ValidateCurrentUserParams } from '../types';
import { User } from '../user';


export default class AuthBusiness {
    initializeUser(params?: UserConstructorParams): User {
        return new User(params);
    }

    currentUser(user: UserEntity, authUser: UserEntity): User {
        this.validateCurrentUser({ id: user.id, authUser });
        return new User({ ...user, clean: true });
    }

    validateCurrentUser({ id, role, status, validateAdmin, authUser } : ValidateCurrentUserParams): void {
        const isAdmin = authUser.role === ERole.ADMIN;

        if(id && id !== authUser.id && !isAdmin) {
            this.throwUnauthorizedError();
        }

        if(role || status && !isAdmin) {
            this.throwUnauthorizedError();
        }

        if(validateAdmin && !isAdmin) {
            this.throwUnauthorizedError();
        }
    }

    getCurrentId(authUser: UserEntity, id?: string): string {
        const authId = authUser.id;
        if(!id) {
            return authId;
        }
        if (id !== authId) {
            this.validateCurrentUser({ validateAdmin: true, authUser });
        }
        return id;
    }

    private throwUnauthorizedError(): void {
        throw new Error({
            message: 'You are not authorized to access this feature',
            statusCode: ERROR_STATUS_CODE.UNAUTHORIZED_EXCEPTION,
        });
    }

}