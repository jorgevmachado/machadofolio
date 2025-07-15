import { Readable } from 'stream';

import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';

import { EGender } from '@repo/services';

import { AuthBusiness, ERole } from '@repo/business';

import { USER_MOCK, USER_PASSWORD } from '../mocks/user.mock';

import { type SignUpAuthDto } from './dto/sign-up-auth.dto';
import { type UpdateAuthDto } from './dto/update-auth.dto';

import { AuthService } from './auth.service';
import { type User } from './entities/user.entity';
import { UsersService } from './users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  const userMockEntity: User = USER_MOCK
  const passwordMock: string = USER_PASSWORD;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          AuthService,
          AuthBusiness,
        {
          provide: UsersService,
          useValue: {
            me: jest.fn(),
            seed: jest.fn(),
            seeds: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            upload: jest.fn(),
            findOne: jest.fn(),
            promote: jest.fn(),
            checkCredentials: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValueOnce('token'),
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('signUp', () => {
    it('should be registered user', async () => {
      const signUpParams: SignUpAuthDto = {
        cpf: userMockEntity.cpf,
        name: userMockEntity.name,
        email: userMockEntity.email,
        gender: userMockEntity.gender,
        whatsapp: userMockEntity.whatsapp,
        password: passwordMock,
        date_of_birth: userMockEntity.date_of_birth,
        password_confirmation: passwordMock
      }
      expect(
          await service.signUp(signUpParams),
      ).toEqual({ message: 'Registration Completed Successfully!' });
    });
  });

  describe('signIn', () => {
    it('should be authenticate user', async () => {
      jest
          .spyOn(userService, 'checkCredentials')
          .mockResolvedValueOnce(userMockEntity);

      expect(
          await service.signIn({
            email: userMockEntity.email,
            password: passwordMock,
          }),
      ).toEqual({ token: 'token', message: 'Authentication Successfully!' });
    });
  });

  describe('findOne', () => {
    it('should be found a complete user', async () => {

      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce({
            ...userMockEntity,
            finance: undefined,
          });

      expect(
          await service.findOne(userMockEntity.id, userMockEntity),
      ).toEqual({
        id: userMockEntity.id,
        cpf: userMockEntity.cpf,
        role: userMockEntity.role,
        name: userMockEntity.name,
        email: userMockEntity.email,
        status: userMockEntity.status,
        gender: userMockEntity.gender,
        whatsapp: userMockEntity.whatsapp,
        date_of_birth: userMockEntity.date_of_birth,
        created_at: userMockEntity.created_at,
        updated_at: userMockEntity.updated_at,
        finance: undefined,
      });
    });
  });

  describe('update', () => {
    it('should update only name and gender user with success', async () => {
      const updateAuthDto: UpdateAuthDto = {
        name: 'Demi Moore',
        role: undefined,
        status: undefined,
        gender: EGender.FEMALE,
      }
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(userMockEntity);

      jest.spyOn(userService, 'update').mockResolvedValueOnce({
        ...userMockEntity,
        name: updateAuthDto.name ?? '',
        gender: updateAuthDto.gender ?? EGender.FEMALE,
      });

      expect(
          await service.update(updateAuthDto, userMockEntity),
      ).toEqual({ message: 'Update Successfully!' });
    });
  });

  describe('me', () => {
    it('should be found a complete user', async () => {
      const received = {
        id: userMockEntity.id,
        cpf: userMockEntity.cpf,
        salt: undefined,
        role: userMockEntity.role,
        name: userMockEntity.name,
        email: userMockEntity.email,
        status: userMockEntity.status,
        avatar: userMockEntity.avatar,
        gender: userMockEntity.gender,
        password: undefined,
        whatsapp: userMockEntity.whatsapp,
        created_at: userMockEntity.created_at,
        updated_at: userMockEntity.updated_at,
        deleted_at: undefined,
        recover_token: undefined,
        date_of_birth: userMockEntity.date_of_birth,
        confirmation_token: undefined,
      }
      jest
          .spyOn(userService, 'me')
          .mockResolvedValueOnce(received);

      expect(await service.me(userMockEntity)).toEqual({
        id: userMockEntity.id,
        cpf: userMockEntity.cpf,
        role: userMockEntity.role,
        name: userMockEntity.name,
        email: userMockEntity.email,
        status: userMockEntity.status,
        avatar: userMockEntity.avatar,
        gender: userMockEntity.gender,
        whatsapp: userMockEntity.whatsapp,
        created_at: userMockEntity.created_at,
        updated_at: userMockEntity.updated_at,
        date_of_birth: userMockEntity.date_of_birth,
      });
    });
  });

  describe('seed', () => {
    it('should be seed data', async () => {
      const expectedReceived = {
        id: userMockEntity.id,
        cpf: userMockEntity.cpf,
        salt: undefined,
        role: userMockEntity.role,
        name: userMockEntity.name,
        email: userMockEntity.email,
        status: userMockEntity.status,
        avatar: userMockEntity.avatar,
        gender: userMockEntity.gender,
        password: undefined,
        whatsapp: userMockEntity.whatsapp,
        created_at: userMockEntity.created_at,
        updated_at: userMockEntity.updated_at,
        deleted_at: undefined,
        recover_token: undefined,
        date_of_birth: userMockEntity.date_of_birth,
        confirmation_token: undefined,
      }
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(expectedReceived);

      jest
          .spyOn(userService, 'seed')
          .mockResolvedValueOnce(expectedReceived);

      expect(await service.seed(userMockEntity, passwordMock)).toEqual(expectedReceived);
    });

    it('should be seed data only message', async () => {
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(userMockEntity);

      jest
          .spyOn(userService, 'seed')
          .mockResolvedValueOnce(userMockEntity);

      expect(await service.seed(userMockEntity, passwordMock, false)).toEqual({ message: 'Seeding Completed Successfully!' });
    });
  });

  describe('seeds', () => {
    it('should be seeds data', async () => {
      const expectedReceived = {
        id: userMockEntity.id,
        cpf: userMockEntity.cpf,
        salt: undefined,
        role: userMockEntity.role,
        name: userMockEntity.name,
        email: userMockEntity.email,
        status: userMockEntity.status,
        avatar: userMockEntity.avatar,
        gender: userMockEntity.gender,
        password: undefined,
        whatsapp: userMockEntity.whatsapp,
        created_at: userMockEntity.created_at,
        updated_at: userMockEntity.updated_at,
        deleted_at: undefined,
        recover_token: undefined,
        date_of_birth: userMockEntity.date_of_birth,
        confirmation_token: undefined,
      }

      jest
          .spyOn(userService, 'seeds')
          .mockResolvedValueOnce([expectedReceived]);

      expect(await service.seeds([userMockEntity], passwordMock)).toEqual([expectedReceived]);
    });

    it('should be seeds data only message', async () => {

      jest
          .spyOn(userService, 'seeds')
          .mockResolvedValueOnce([userMockEntity]);

      expect(await service.seeds([userMockEntity], passwordMock, false)).toEqual({ message: 'Seeding list of user Completed Successfully!' });
    });
  });

  describe('promoteUser', () => {
    it('should promote user with success', async () => {
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce({ ...userMockEntity, role: ERole.USER });

      jest.spyOn(userService, 'promote').mockResolvedValueOnce({
        user: { ...userMockEntity, role: ERole.ADMIN },
        valid: true,
        message: 'User promoted successfully!',
      });

      expect(
          await service.promoteUser(userMockEntity.id, {
            ...userMockEntity,
            role: ERole.ADMIN,
          }),
      ).toEqual({
        user: { ...userMockEntity, role: ERole.ADMIN },
        valid: true,
        message: 'User promoted successfully!',
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
    it('should upload file with success', async () => {
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(userMockEntity);

      jest.spyOn(userService, 'upload').mockResolvedValueOnce({
        ...userMockEntity,
        avatar: `http://localhost:3001/uploads/${userMockEntity.email}.jpeg`
      });

      expect(
          await service.upload(mockFile, userMockEntity),
      ).toEqual({ message: 'File uploaded successfully!' });
    });
  });
});
