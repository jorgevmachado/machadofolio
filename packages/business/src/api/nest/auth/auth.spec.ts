import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';
import { EGender } from '@repo/services/personal-data/enum';

import { ERole, EStatus } from '../../enum';

import { NestModuleAbstract } from '../abstract';

import type { ISignInParams, ISignUpParams } from './types';

import { Auth } from './auth';

jest.mock('../abstract');

describe('Auth', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let auth: Auth;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        auth = new Auth(mockConfig);
    });
    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('should initialize with the correct path and config', () => {
            expect(NestModuleAbstract).toHaveBeenCalledTimes(1);
            expect(NestModuleAbstract).toHaveBeenCalledWith({
                pathUrl: 'auth',
                nestModuleConfig: mockConfig,
            });
        });
    });

    describe('signUp', () => {
        it('should call post with correct URL and body for signUp', async () => {
            const mockPost = jest
                .spyOn(NestModuleAbstract.prototype, 'post')
                .mockResolvedValue({ message: 'User registered successfully' });

            (NestModuleAbstract.prototype as any).pathUrl = 'auth';

            const mockSignUpParams: ISignUpParams = {
                cpf: '12345678909',
                name: 'Test User',
                email: 'testuser@example.com',
                gender: EGender.MALE,
                password: 'testPassword',
                whatsapp: '123456789',
                date_of_birth: new Date('2000-01-01'),
                password_confirmation: 'testPassword',
            };
            const result = await auth.signUp(mockSignUpParams);

            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith('auth/signUp', {
                body: mockSignUpParams,
            });
            expect(result).toEqual({ message: 'User registered successfully' });
        });
    });

    describe('signIn', () => {
        it('should call post with correct URL and body for signIn', async () => {
            const mockPost = jest
                .spyOn(NestModuleAbstract.prototype, 'post')
                .mockResolvedValue({ token: 'mock-jwt-token' });

            const mockSignInParams: ISignInParams = {
                email: 'testUser',
                password: 'testPassword',
            };
            const result = await auth.signIn(mockSignInParams);

            expect(mockPost).toHaveBeenCalledTimes(1);
            expect(mockPost).toHaveBeenCalledWith('auth/signIn', {
                body: mockSignInParams,
            });
            expect(result).toEqual({ token: 'mock-jwt-token' });
        });
    });

    describe('me', () => {
        it('should call get with correct URL for me', async () => {
            const mockGet = jest
                .spyOn(NestModuleAbstract.prototype, 'get')
                .mockResolvedValue({
                    id: '1',
                    username: 'testUser',
                    email: 'testUser@example.com',
                });

            const result = await auth.me();

            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledWith('auth/me');
            expect(result).toEqual({
                id: '1',
                username: 'testUser',
                email: 'testUser@example.com',
            });
        });
    });

    describe('updateAuth', () => {
        it('should call path with correct URL and body for updateAuth', async () => {
            const mockPath = jest
                .spyOn(NestModuleAbstract.prototype, 'path')
                .mockResolvedValue({ message: 'Update Successfully!' });

            const pathParams = {
                id: '1',
                role: ERole.USER,
                name: 'James Bond',
                gender: EGender.MALE,
                status: EStatus.COMPLETE,
                date_of_birth: new Date('2000-01-01'),
            };

            const result = await auth.updateAuth(pathParams);

            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockPath).toHaveBeenCalledWith('auth/update', { body: pathParams });
            expect(result).toEqual({ message: 'Update Successfully!' });
        });
    });

    describe('uploadPicture', () => {
        it('should call path with correct URL and body for uploadPicture', async () => {
            const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
            const mockPath = jest
                .spyOn(NestModuleAbstract.prototype, 'path')
                .mockResolvedValue({ message: 'File uploaded successfully!' });
            const result = await auth.uploadPicture(mockFile);
            const formData = new FormData();
            formData.append('file', mockFile);
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockPath).toHaveBeenCalledWith('auth/upload', { body: formData });
            expect(result).toEqual({ message: 'File uploaded successfully!' });
        });
    });
});