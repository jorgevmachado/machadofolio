import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { type Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { USER_ENTITY_MOCK } from '@repo/business/auth/mock/mock';

import { User } from '../../auth/entities/user.entity';

import { AuthJwtStrategy } from './auth-jwt.strategy';

describe('AuthJwtStrategy', () => {
    let authJwtStrategy: AuthJwtStrategy;
    let repository: Repository<User>;
    let queryBuilderMock: any;

    const mockUser: User = USER_ENTITY_MOCK;

    beforeEach(async () => {
        queryBuilderMock = {
            where: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getOne: jest.fn(),
        };

        const repositoryMock = {
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
        };


        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthJwtStrategy,
                { provide: getRepositoryToken(User), useValue: repositoryMock },
            ],
        }).compile();

        authJwtStrategy = module.get<AuthJwtStrategy>(AuthJwtStrategy);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(authJwtStrategy).toBeDefined();
    });

    describe('validate', () => {
        it('should return the user when found.', async () => {
            queryBuilderMock.getOne.mockResolvedValueOnce(mockUser);

            const result = await authJwtStrategy.validate({ id: mockUser.id });

            expect(result).toEqual(mockUser);
            expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
            expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('users.id = :id', { id: mockUser.id });
        });

        it('should throw UnauthorizedException if user is not found.', async () => {
            queryBuilderMock.getOne.mockResolvedValueOnce(null);

            await expect(authJwtStrategy.validate({ id: mockUser.id })).rejects.toThrow(UnauthorizedException);
            expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
            expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('users.id = :id', { id: mockUser.id });
        });
    });
});