jest.mock('../abstract', () => {
    class NestModuleAbstract {
        public pathUrl: string;
        public get = jest.fn<(...args: any[]) => Promise<any>>();
        public post = jest.fn<(...args: any[]) => Promise<any>>();
        public path = jest.fn<(...args: any[]) => Promise<any>>();

        constructor(config: any) {
            this.pathUrl = config?.pathUrl;
        }
    }

    return { NestModuleAbstract };
});

import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import { EGender } from '@repo/services';
import { ERole, EStatus } from '../../../enum';
import type { ISignInParams, ISignUpParams } from './types';
import { Auth } from './auth';

class MockFile {
    public lastModified = 0;
    public webkitRelativePath = '';
    public size = 0;
    public type = 'image/png';
    public name: string;
    public bytes = new Uint8Array(); // Adicionado para compatibilidade com File
    public arrayBuffer = async () => new ArrayBuffer(0);
    public slice = () => this;
    public stream = () => ({
        [Symbol.asyncIterator]: async function* () {
        }
    });
    public text = async () => '';

    constructor(public content: any, name: string, public options: any) {
        this.name = name;
    }
}

class MockFormData {
    private data: Record<string, any> = {};

    append(key: string, value: any) {
        this.data[key] = value;
    }
}

(global as any).File = MockFile;
(global as any).FormData = MockFormData;


describe('Auth', () => {
    const mockBaseUrl = 'http://mock-base-url.com';
    const mockHeaders = { Authorization: 'Bearer test-token' };
    const mockConfig = { baseUrl: mockBaseUrl, headers: mockHeaders };

    let auth: Auth;
    beforeEach(() => {
        jest.clearAllMocks();
        auth = new Auth(mockConfig);
    });
    afterEach(() => {
        jest.resetModules();
    });


    describe('signUp', () => {
        it('should call post with correct URL and body for signUp', async () => {
            (auth.post as any)
                .mockResolvedValue({ message: 'User registered successfully' });
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
            expect(auth.post).toHaveBeenCalledTimes(1);
            expect(auth.post).toHaveBeenCalledWith('auth/signUp', {
                body: mockSignUpParams,
            });
            expect(result).toEqual({ message: 'User registered successfully' });
        });
    });

    describe('signIn', () => {
        it('should call post with correct URL and body for signIn', async () => {
            (auth.post as any)
            .mockResolvedValue({ token: 'mock-jwt-token' });
            const mockSignInParams: ISignInParams = {
                email: 'testUser',
                password: 'testPassword',
            };
            const result = await auth.signIn(mockSignInParams);
            expect(auth.post).toHaveBeenCalledTimes(1);
            expect(auth.post).toHaveBeenCalledWith('auth/signIn', {
                body: mockSignInParams,
            });
            expect(result).toEqual({ token: 'mock-jwt-token' });
        });
    });

    describe('me', () => {
        it('should call get with correct URL for me', async () => {
            (auth.get as any).mockResolvedValue({
                id: '1',
                username: 'testUser',
                email: 'testUser@example.com',
            });
            const result = await auth.me();
            expect(auth.get).toHaveBeenCalledTimes(1);
            expect(auth.get).toHaveBeenCalledWith('auth/me');
            expect(result).toEqual({
                id: '1',
                username: 'testUser',
                email: 'testUser@example.com',
            });
        });
    });

    describe('updateAuth', () => {
        it('should call path with correct URL and body for updateAuth', async () => {
            (auth.path as any).mockResolvedValue({ message: 'Update Successfully!' });
            const pathParams = {
                id: '1',
                role: ERole.USER,
                name: 'James Bond',
                gender: EGender.MALE,
                status: EStatus.COMPLETE,
                date_of_birth: new Date('2000-01-01'),
            };
            const result = await auth.updateAuth(pathParams);
            expect(auth.path).toHaveBeenCalledTimes(1);
            expect(auth.path).toHaveBeenCalledWith('auth/update', { body: pathParams });
            expect(result).toEqual({ message: 'Update Successfully!' });
        });
    });

    describe('uploadPicture', () => {
        it('should call path with correct URL and body for uploadPicture', async () => {
            const mockFile = new MockFile(['test'], 'test.png', { type: 'image/png' });
            (auth.path as any).mockResolvedValue({ message: 'File uploaded successfully!' });
            const result = await auth.uploadPicture(mockFile as unknown as File);
            const formData = new MockFormData();
            formData.append('file', mockFile);
            expect(auth.path).toHaveBeenCalledTimes(1);
            expect(auth.path).toHaveBeenCalledWith('auth/upload', { body: expect.any(MockFormData) });
            expect(result).toEqual({ message: 'File uploaded successfully!' });
        });
    });
});