jest.mock('../../shared', () => {
    class ServiceMock {
        save = jest.fn();
        file = {
            upload: jest.fn(),
            getPath: jest.fn(),
        };
        findOne = jest.fn();
        queries ={
            findBy: jest.fn(),
        };
    }
    return { Service: ServiceMock }
});

import { Readable } from 'stream';
import fs from 'fs';
import { writeFile } from 'fs/promises';

import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EGender } from '@repo/services';

import { ERole, EStatus } from '@repo/business';

import { USER_MOCK, USER_PASSWORD } from '../../mocks/user.mock';
import { User } from '../entities/user.entity';

import { type UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

jest.mock('fs');
jest.mock('fs/promises', () => ({
    writeFile: jest.fn(),
}));

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    const mockEntity: User = USER_MOCK;
    const mockPassword: string = USER_PASSWORD;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useClass: Repository },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a user ', async () => {
            jest.spyOn(service, 'hasInactiveUser' as any).mockImplementation(async () => false);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(USER_MOCK);
            jest.spyOn(service, 'save').mockResolvedValueOnce(USER_MOCK);

            expect(
                await service.create({
                    cpf: USER_MOCK.cpf,
                    name: USER_MOCK.name,
                    email: USER_MOCK.email,
                    gender: USER_MOCK.gender,
                    whatsapp: USER_MOCK.whatsapp,
                    password: USER_PASSWORD,
                    date_of_birth: USER_MOCK.date_of_birth,
                    password_confirmation: USER_PASSWORD,
                }),
            ).toEqual(USER_MOCK);
        });

        it('should return error a user already exist ', async () => {
            jest.spyOn(service, 'hasInactiveUser' as any).mockImplementation(async (by) => {
                if(by === 'whatsapp') {
                    throw new BadRequestException();
                }
                return false;
            });

            await expect(
                service.create({
                    cpf: USER_MOCK.cpf,
                    name: USER_MOCK.name,
                    email: USER_MOCK.email,
                    gender: USER_MOCK.gender,
                    whatsapp: USER_MOCK.whatsapp,
                    password: USER_PASSWORD,
                    date_of_birth: USER_MOCK.date_of_birth,
                    password_confirmation: USER_PASSWORD,
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update user with name and role fields', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(USER_MOCK);

            const updateAuthDto: UpdateUserDto = {
                name: 'Demi Moore',
                role: ERole.ADMIN,
                gender: undefined,
                status: undefined,
                date_of_birth: undefined,
            };

            const expected = {
                ...USER_MOCK,
                ...updateAuthDto,
            };

            jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

            expect(await service.update(USER_MOCK.id, updateAuthDto)).toEqual(
                expected,
            );
        });

        it('should update user with gender, status, and date_of_birth fields', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(USER_MOCK);

            const updateAuthDto: UpdateUserDto = {
                name: undefined,
                role: undefined,
                gender: EGender.FEMALE,
                status: EStatus.COMPLETE,
                date_of_birth: new Date('2000-01-01'),
            };

            const expected = {
                ...USER_MOCK,
                ...updateAuthDto,
            };

            jest.spyOn(service, 'save').mockResolvedValueOnce(expected);

            expect(await service.update(USER_MOCK.id, updateAuthDto)).toEqual(
                expected,
            );
        });

        it('It should return the user without changes.', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(USER_MOCK);

            expect(
                await service.update(USER_MOCK.id, {
                    name: undefined,
                    role: undefined,
                    gender: undefined,
                    status: undefined,
                    date_of_birth: undefined,
                }),
            ).toEqual(USER_MOCK);
        });
    });

    describe('checkCredentials', () => {
        it('should return true', async () => {
            jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce(USER_MOCK);

            expect(
                await service.checkCredentials({
                    email: USER_MOCK.email,
                    password: USER_PASSWORD,
                }),
            ).toEqual(USER_MOCK);
        });

        it('should return false because the user is inactive', async () => {
            jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce({
                ...USER_MOCK,
                status: EStatus.INACTIVE,
            });

            await expect(
                service.checkCredentials({
                    email: USER_MOCK.email,
                    password: USER_PASSWORD,
                }),
            ).rejects.toThrow(UnprocessableEntityException);
        });

        it('should return false because the credentials is incorrectly', async () => {
            jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce(USER_MOCK);

            await expect(
                service.checkCredentials({
                    email: USER_MOCK.email,
                    password: '@Password2',
                }),
            ).rejects.toThrow(UnprocessableEntityException);
        });
    });

    describe('promote', () => {
        const promoteEntityUser = USER_MOCK;
        it('should promote user', async () => {
            jest
                .spyOn(service, 'save')
                .mockResolvedValueOnce({ ...promoteEntityUser, role: ERole.ADMIN });

            expect(
                await service.promote({
                    ...promoteEntityUser,
                    role: ERole.USER,
                }),
            ).toEqual({
                user: {
                    ...promoteEntityUser,
                    salt: undefined,
                    role: ERole.ADMIN,
                    avatar: undefined,
                    password: undefined,
                    deleted_at: undefined,
                    recover_token: undefined,
                    confirmation_token: undefined,
                },
                valid: true,
                message: 'User promoted successfully!',
            });
        });

        it('should return the message that the user is already an admin', async () => {
            const adminEntityUser = {
                ...promoteEntityUser,
                role: ERole.ADMIN,
            }

            expect(await service.promote(adminEntityUser)).toEqual({
                user: adminEntityUser,
                valid: false,
                message: 'The User is already admin.',
            });
        });
    });

    describe('upload', () => {
        const mockedStream = new Readable();
        mockedStream.push('mock stream content');
        mockedStream.push(null);
        const mockFile: Express.Multer.File = {
            fieldname: 'file',
            originalname: 'test-image.jpeg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            size: 1024,
            buffer: Buffer.from('mock file content'),
            destination: 'uploads/',
            filename: 'test-image.jpeg',
            path: 'uploads/test-image.jpeg',
            stream: mockedStream,
        };
        it('should return the path of the file with default file structure', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(USER_MOCK);

            jest.spyOn(fs, 'existsSync').mockReturnValue(false);

            (writeFile as jest.MockedFunction<typeof writeFile>).mockResolvedValue();

            jest.spyOn(service.file, 'upload').mockResolvedValueOnce('mocked/path/file.txt');

            jest.spyOn(service, 'save').mockResolvedValue({
                ...USER_MOCK,
                avatar: `http://localhost:3001/uploads/${USER_MOCK.email}.jpeg`,
            });

            expect(await service.upload(USER_MOCK.id, mockFile)).toEqual({
                ...USER_MOCK,
                avatar: `http://localhost:3001/uploads/${USER_MOCK.email}.jpeg`,
            });
        });
    });

    describe('me', () => {
        it('should be found a complete user', async () => {
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValueOnce(USER_MOCK);

            expect(await service.me(USER_MOCK.id)).toEqual({
                id: USER_MOCK.id,
                cpf: USER_MOCK.cpf,
                salt: undefined,
                role: USER_MOCK.role,
                name: USER_MOCK.name,
                email: USER_MOCK.email,
                status: USER_MOCK.status,
                avatar: USER_MOCK.avatar,
                gender: USER_MOCK.gender,
                finance: USER_MOCK.finance,
                password: undefined,
                whatsapp: USER_MOCK.whatsapp,
                created_at: USER_MOCK.created_at,
                updated_at: USER_MOCK.updated_at,
                deleted_at: undefined,
                recover_token: undefined,
                date_of_birth: USER_MOCK.date_of_birth,
                confirmation_token: undefined,
            });
        });
    });

    describe('seed', () => {
        const seedEntityUser: User = {
            id: USER_MOCK.id,
            cpf: USER_MOCK.cpf,
            salt: undefined,
            role: USER_MOCK.role,
            name: USER_MOCK.name,
            email: USER_MOCK.email,
            status: USER_MOCK.status,
            avatar: USER_MOCK.avatar,
            gender: USER_MOCK.gender,
            password: undefined,
            whatsapp: USER_MOCK.whatsapp,
            created_at: USER_MOCK.created_at,
            updated_at: USER_MOCK.updated_at,
            deleted_at: undefined,
            recover_token: undefined,
            date_of_birth: USER_MOCK.date_of_birth,
            confirmation_token: undefined,
        };

        it('should seed the database when exist in database', async () => {
            jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce(seedEntityUser);

            expect(await service.seed(seedEntityUser, mockPassword)).toEqual(seedEntityUser);
        });

        it('should seed the database when not exist in database', async () => {
            jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce(null);

            jest.spyOn(service, 'create').mockResolvedValueOnce(seedEntityUser);

            jest.spyOn(service, 'promote' as any).mockResolvedValueOnce({ user: {...seedEntityUser, role: ERole.ADMIN }});

            jest.spyOn(service, 'findOne').mockResolvedValueOnce({...seedEntityUser, role: ERole.ADMIN });

            expect(await service.seed({
                ...seedEntityUser,
                role: ERole.ADMIN,
            }, mockPassword)).toEqual({
                ...seedEntityUser,
                role: ERole.ADMIN,
            });
        });
    });

    describe('seeds', () => {
        it('should seeds the database when exist in database', async () => {
            jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce(mockEntity);

            expect(await service.seeds([mockEntity], mockPassword)).toEqual([{
                ...mockEntity,
                salt: undefined,
                password: undefined,
                deleted_at: undefined,
                confirmation_token: undefined,
            }]);
        });
    });

    describe('privates', () => {
        describe('hasInactiveUser', () => {
            it('should return throw error  because the user is inactive', async () => {
                jest.spyOn(service.queries, 'findBy').mockResolvedValueOnce(mockEntity);
                await expect(service['hasInactiveUser']( 'email', mockEntity.email)).rejects.toThrow(BadRequestException);
            })
        })
    });
});
