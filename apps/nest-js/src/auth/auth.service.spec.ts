import { Readable } from 'stream';

import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';

import { EGender } from '@repo/services/personal-data/enum';

import { USER_ENTITY_MOCK, USER_PASSWORD } from '@repo/business/auth/mock/mock';
import AuthBusiness from '@repo/business/auth/business/business';
import { ERole } from '@repo/business/enum';

import { type SignUpAuthDto } from './dto/sign-up-auth.dto';
import { type UpdateAuthDto } from './dto/update-auth.dto';

import { UsersService } from './users/users.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

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
        cpf: USER_ENTITY_MOCK.cpf,
        name: USER_ENTITY_MOCK.name,
        email: USER_ENTITY_MOCK.email,
        gender: USER_ENTITY_MOCK.gender,
        whatsapp: USER_ENTITY_MOCK.whatsapp,
        password: USER_PASSWORD,
        date_of_birth: USER_ENTITY_MOCK.date_of_birth,
        password_confirmation: USER_PASSWORD
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
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      expect(
          await service.signIn({
            email: USER_ENTITY_MOCK.email,
            password: USER_PASSWORD,
          }),
      ).toEqual({ token: 'token', message: 'Authentication Successfully!' });
    });
  });

  describe('findOne', () => {
    it('should be found a complete user', async () => {

      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      expect(
          await service.findOne(USER_ENTITY_MOCK.id, USER_ENTITY_MOCK),
      ).toEqual({
        id: USER_ENTITY_MOCK.id,
        cpf: USER_ENTITY_MOCK.cpf,
        role: USER_ENTITY_MOCK.role,
        name: USER_ENTITY_MOCK.name,
        email: USER_ENTITY_MOCK.email,
        status: USER_ENTITY_MOCK.status,
        gender: USER_ENTITY_MOCK.gender,
        whatsapp: USER_ENTITY_MOCK.whatsapp,
        date_of_birth: USER_ENTITY_MOCK.date_of_birth,
        created_at: USER_ENTITY_MOCK.created_at,
        updated_at: USER_ENTITY_MOCK.updated_at,
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
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      jest.spyOn(userService, 'update').mockResolvedValueOnce({
        ...USER_ENTITY_MOCK,
        name: updateAuthDto.name ?? '',
        gender: updateAuthDto.gender ?? EGender.FEMALE,
      });

      expect(
          await service.update(updateAuthDto, USER_ENTITY_MOCK),
      ).toEqual({ message: 'Update Successfully!' });
    });
  });

  describe('me', () => {
    it('should be found a complete user', async () => {
      const received = {
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
      }
      jest
          .spyOn(userService, 'me')
          .mockResolvedValueOnce(received);

      expect(await service.me(USER_ENTITY_MOCK)).toEqual({
        id: USER_ENTITY_MOCK.id,
        cpf: USER_ENTITY_MOCK.cpf,
        role: USER_ENTITY_MOCK.role,
        name: USER_ENTITY_MOCK.name,
        email: USER_ENTITY_MOCK.email,
        status: USER_ENTITY_MOCK.status,
        avatar: USER_ENTITY_MOCK.avatar,
        gender: USER_ENTITY_MOCK.gender,
        whatsapp: USER_ENTITY_MOCK.whatsapp,
        created_at: USER_ENTITY_MOCK.created_at,
        updated_at: USER_ENTITY_MOCK.updated_at,
        date_of_birth: USER_ENTITY_MOCK.date_of_birth,
      });
    });
  });

  describe('seed', () => {
    it('should be seed data', async () => {
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      jest
          .spyOn(userService, 'seed')
          .mockResolvedValueOnce({
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

      expect(await service.seed()).toEqual({
        id: USER_ENTITY_MOCK.id,
        cpf: USER_ENTITY_MOCK.cpf,
        role: USER_ENTITY_MOCK.role,
        name: USER_ENTITY_MOCK.name,
        email: USER_ENTITY_MOCK.email,
        status: USER_ENTITY_MOCK.status,
        gender: USER_ENTITY_MOCK.gender,
        whatsapp: USER_ENTITY_MOCK.whatsapp,
        date_of_birth: USER_ENTITY_MOCK.date_of_birth,
        created_at: USER_ENTITY_MOCK.created_at,
        updated_at: USER_ENTITY_MOCK.updated_at,
      });
    });

    it('should be seed data only message', async () => {
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      jest
          .spyOn(userService, 'seed')
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      expect(await service.seed(false)).toEqual({ message: 'Seeding Completed Successfully!' });
    });
  });

  describe('promoteUser', () => {
    it('should promote user with success', async () => {
      jest
          .spyOn(userService, 'findOne')
          .mockResolvedValueOnce({ ...USER_ENTITY_MOCK, role: ERole.USER });

      jest.spyOn(userService, 'promote').mockResolvedValueOnce({
        user: { ...USER_ENTITY_MOCK, role: ERole.ADMIN },
        valid: true,
        message: 'User promoted successfully!',
      });

      expect(
          await service.promoteUser(USER_ENTITY_MOCK.id, {
            ...USER_ENTITY_MOCK,
            role: ERole.ADMIN,
          }),
      ).toEqual({
        user: { ...USER_ENTITY_MOCK, role: ERole.ADMIN },
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
          .mockResolvedValueOnce(USER_ENTITY_MOCK);

      jest.spyOn(userService, 'upload').mockResolvedValueOnce({
        ...USER_ENTITY_MOCK,
        avatar: `http://localhost:3001/uploads/${USER_ENTITY_MOCK.email}.jpeg`
      });

      expect(
          await service.upload(mockFile, USER_ENTITY_MOCK),
      ).toEqual({ message: 'File uploaded successfully!' });
    });
  });
});
