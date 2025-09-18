import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { Error } from '@repo/services';

import { ERole, EStatus } from '../../enum';

import { type UserConstructorParams, type UserEntity } from '../types';
import { USER_ENTITY_MOCK } from '../mock';
import { User } from '../user';

import Business from './business';

jest.mock('../user');

describe('AuthBusiness', () => {
    let authBusiness: Business;
    const mockUser: UserEntity = USER_ENTITY_MOCK;
    const mockAuthUser: UserEntity = {
        ...mockUser,
        id: '6afbb81f-d2c7-4195-b23b-e47fefe4e743',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        authBusiness = new Business();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('initializeUser', () => {
        xit('should create a new User instance with provided params', () => {
            const params: UserConstructorParams = {
                cpf: mockUser.cpf,
                role: mockUser.role,
                name: mockUser.name,
                email: mockUser.email,
                gender: mockUser.gender,
                status: mockUser.status,
                whatsapp: mockUser.whatsapp,
                date_of_birth: mockUser.date_of_birth,
            };
            const user = authBusiness.initializeUser(params);

            expect(User).toHaveBeenCalledTimes(1);
            expect(User).toHaveBeenCalledWith(params);
            expect(user).toBeInstanceOf(User);
        });

        xit('should create a new User instance with default params if none are provided', () => {
            const user = authBusiness.initializeUser();

            expect(User).toHaveBeenCalledTimes(1);
            expect(User).toHaveBeenCalledWith(undefined);
            expect(user).toBeInstanceOf(User);
        });
    });

    describe('currentUser', () => {
        xit('should validate the current user and return a new User instance', () => {
            const result = authBusiness.currentUser(mockUser, mockUser);
            expect(User).toHaveBeenCalledTimes(1);
            expect(User).toHaveBeenCalledWith({ ...mockUser, clean: true });
            expect(result).toBeInstanceOf(User);
        });

        xit('should throw an error if the user is not authorized', () => {
            expect(() =>
                authBusiness.currentUser(mockUser, mockAuthUser),
            ).toThrowError('You are not authorized to access this feature');
        });
    });

    describe('validateCurrentUser', () => {
        xit('should not throw an error if the IDs match', () => {
            expect(() =>
                authBusiness.validateCurrentUser({
                    id: mockUser.id,
                    authUser: mockUser,
                }),
            ).not.toThrow();
        });

        xit('should not throw an error if the auth user has the ADMIN role', () => {
            expect(() =>
                authBusiness.validateCurrentUser({
                    id: mockUser.id,
                    authUser: {
                        ...mockAuthUser,
                        role: ERole.ADMIN,
                    },
                }),
            ).not.toThrow();
        });

        xit('should throw an error if the IDs do not match and the auth user is not an ADMIN', () => {
            expect(() =>
                authBusiness.validateCurrentUser({
                    id: mockUser.id,
                    authUser: mockAuthUser,
                }),
            ).toThrowError('You are not authorized to access this feature');
        });

        xit('should throw an error if has role in param and the auth user is not an ADMIN', () => {
            expect(() =>
                authBusiness.validateCurrentUser({
                    role: ERole.ADMIN,
                    authUser: mockAuthUser,
                }),
            ).toThrowError('You are not authorized to access this feature');
        });

        xit('should throw an error if has status in param and the auth user is not an ADMIN', () => {
            expect(() =>
                authBusiness.validateCurrentUser({
                    status: EStatus.ACTIVE,
                    authUser: mockAuthUser,
                }),
            ).toThrowError('You are not authorized to access this feature');
        });

        xit('should throw an error if param validateAdmin is true and the auth user is not an ADMIN', () => {
            expect(() =>
                authBusiness.validateCurrentUser({
                    authUser: mockAuthUser,
                    validateAdmin: true,
                }),
            ).toThrowError('You are not authorized to access this feature');
        });

        xit('should throw an error with the correct status code', () => {
            try {
                authBusiness.validateCurrentUser({
                    id: mockUser.id,
                    authUser: mockAuthUser,
                });
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
            }
        });
    });

    describe('getCurrentId', () => {
        xit('should return the auth user ID if no ID is provided', () => {
            expect(authBusiness.getCurrentId(mockAuthUser)).toBe(mockAuthUser.id);
        });

        xit('should return the provided ID if it matches the auth user ID', () => {
            expect(authBusiness.getCurrentId(mockAuthUser, mockAuthUser.id)).toBe(mockAuthUser.id);
        });

        xit('should validate the current user if the provided ID does not match the auth user ID', () => {
            const currentMockUser = {
                ...mockAuthUser,
                role: ERole.ADMIN,
            };
            expect(authBusiness.getCurrentId(currentMockUser, mockUser.id)).toBe(mockUser.id);
        });

        xit('should throw an error if the provided ID does not match the auth user ID and the auth user is not an ADMIN', () => {
            expect(() =>
                authBusiness.getCurrentId(mockAuthUser, mockUser.id),
            ).toThrowError('You are not authorized to access this feature');
        });
    });
});