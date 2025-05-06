import { Readable } from 'stream';
import fs from 'fs';
import { writeFile } from 'fs/promises';

import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { EGender } from '@repo/services/personal-data/enum';

import { ERole, EStatus } from '@repo/business/enum';
import { USER_ENTITY_MOCK, USER_MOCK, USER_PASSWORD } from '@repo/business/auth/mock/mock';

import { type UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';


jest.mock('fs');
jest.mock('fs/promises', () => ({
    writeFile: jest.fn(),
}));

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

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
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(USER_MOCK as User);

            expect(
                await service.create({
                    cpf: USER_ENTITY_MOCK.cpf,
                    name: USER_ENTITY_MOCK.name,
                    email: USER_ENTITY_MOCK.email,
                    gender: USER_ENTITY_MOCK.gender,
                    whatsapp: USER_ENTITY_MOCK.whatsapp,
                    password: USER_PASSWORD,
                    date_of_birth: USER_ENTITY_MOCK.date_of_birth,
                    password_confirmation: USER_PASSWORD,
                }),
            ).toEqual(USER_MOCK);
        });

        it('should return error a user already exist ', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_MOCK),
            } as any);

            await expect(
                service.create({
                    cpf: USER_ENTITY_MOCK.cpf,
                    name: USER_ENTITY_MOCK.name,
                    email: USER_ENTITY_MOCK.email,
                    gender: USER_ENTITY_MOCK.gender,
                    whatsapp: USER_ENTITY_MOCK.whatsapp,
                    password: USER_PASSWORD,
                    date_of_birth: USER_ENTITY_MOCK.date_of_birth,
                    password_confirmation: USER_PASSWORD,
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update user with name and role fields', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_MOCK),
            } as any);

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

            jest.spyOn(repository, 'save').mockResolvedValueOnce(expected as User);

            expect(await service.update(USER_MOCK.id, updateAuthDto)).toEqual(
                expected,
            );
        });

        it('should update user with gender, status, and date_of_birth fields', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_MOCK),
            } as any);

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

            jest.spyOn(repository, 'save').mockResolvedValueOnce(expected as User);

            expect(await service.update(USER_MOCK.id, updateAuthDto)).toEqual(
                expected,
            );
        });

        it('It should return the user without changes.', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_MOCK),
            } as any);

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
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                withDeleted: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_ENTITY_MOCK),
            } as any);

            expect(
                await service.checkCredentials({
                    email: USER_MOCK.email,
                    password: USER_PASSWORD,
                }),
            ).toEqual(USER_ENTITY_MOCK);
        });

        it('should return false because the user is inactive', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                withDeleted: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce({
                    ...USER_ENTITY_MOCK,
                    status: EStatus.INACTIVE,
                }),
            } as any);

            await expect(
                service.checkCredentials({
                    email: USER_MOCK.email,
                    password: USER_PASSWORD,
                }),
            ).rejects.toThrow(UnprocessableEntityException);
        });

        it('should return false because the credentials is incorrectly', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                withDeleted: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_ENTITY_MOCK),
            } as any);

            await expect(
                service.checkCredentials({
                    email: USER_MOCK.email,
                    password: '@Password2',
                }),
            ).rejects.toThrow(UnprocessableEntityException);
        });
    });

    describe('promote', () => {
        const promoteEntityUser = USER_ENTITY_MOCK as User;
        it('should promote user', async () => {
            jest
                .spyOn(repository, 'save')
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
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(adminEntityUser),
            } as any);

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
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(USER_ENTITY_MOCK),
            } as any);

            jest.spyOn(fs, 'existsSync').mockReturnValue(false);

            (writeFile as jest.MockedFunction<typeof writeFile>).mockResolvedValue();

            jest.spyOn(service as any, 'save').mockResolvedValue({
                ...USER_ENTITY_MOCK,
                avatar: `http://localhost:3001/uploads/${USER_ENTITY_MOCK.email}.jpeg`,
            });

            expect(await service.upload(USER_ENTITY_MOCK.id, mockFile)).toEqual({
                ...USER_ENTITY_MOCK,
                avatar: `http://localhost:3001/uploads/${USER_ENTITY_MOCK.email}.jpeg`,
            });
        });
    });

    describe('seed', () => {
        const seedEntityUser: User = {
            id: USER_ENTITY_MOCK.id,
            cpf: USER_ENTITY_MOCK.cpf,
            salt: undefined,
            role: USER_ENTITY_MOCK.role,
            name: USER_ENTITY_MOCK.name,
            email: USER_ENTITY_MOCK.email,
            status: USER_ENTITY_MOCK.status,
            avatar: USER_ENTITY_MOCK.avatar,
            gender: USER_ENTITY_MOCK.gender,
            password: undefined,
            whatsapp: USER_ENTITY_MOCK.whatsapp,
            created_at: USER_ENTITY_MOCK.created_at,
            updated_at: USER_ENTITY_MOCK.updated_at,
            deleted_at: undefined,
            recover_token: undefined,
            date_of_birth: USER_ENTITY_MOCK.date_of_birth,
            confirmation_token: undefined,
        };

        it('should seed the database when exist in database', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                leftJoinAndSelect: jest.fn(),
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(seedEntityUser),
            } as any);

            expect(await service.seed()).toEqual(seedEntityUser);
        });

        it('should seed the database when not exist in database', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(null),
            } as any);

            jest.spyOn(repository, 'save').mockResolvedValueOnce(seedEntityUser);

            jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
                andWhere: jest.fn(),
                withDeleted: jest.fn(),
                leftJoinAndSelect: jest.fn(),
                getOne: jest.fn().mockReturnValueOnce(seedEntityUser),
            } as any);

            jest
                .spyOn(repository, 'save')
                .mockResolvedValueOnce({ ...seedEntityUser, role: ERole.ADMIN });

            expect(await service.seed()).toEqual({
                ...seedEntityUser,
                role: ERole.ADMIN,
            });
        });
    });

    describe('me', () => {
        it('should be found a complete user', async () => {
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValueOnce(USER_ENTITY_MOCK);

            expect(await service.me(USER_ENTITY_MOCK.id)).toEqual({
                id: USER_ENTITY_MOCK.id,
                cpf: USER_ENTITY_MOCK.cpf,
                salt: undefined,
                role: USER_ENTITY_MOCK.role,
                name: USER_ENTITY_MOCK.name,
                email: USER_ENTITY_MOCK.email,
                status: USER_ENTITY_MOCK.status,
                avatar: USER_ENTITY_MOCK.avatar,
                gender: USER_ENTITY_MOCK.gender,
                password: undefined,
                whatsapp: USER_ENTITY_MOCK.whatsapp,
                created_at: USER_ENTITY_MOCK.created_at,
                updated_at: USER_ENTITY_MOCK.updated_at,
                deleted_at: undefined,
                recover_token: undefined,
                date_of_birth: USER_ENTITY_MOCK.date_of_birth,
                confirmation_token: undefined,
            });
        });
    });
});
