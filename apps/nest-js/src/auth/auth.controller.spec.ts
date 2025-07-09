import { Test, type TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';

import { USER_ENTITY_MOCK, USER_PASSWORD } from '@repo/business/auth/mock/mock';
import { ERole } from '@repo/business/enum';

import { type SignUpAuthDto } from './dto/sign-up-auth.dto';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            me: jest.fn(),
            seed: jest.fn(),
            signUp: jest.fn(),
            signIn: jest.fn(),
            update: jest.fn(),
            upload: jest.fn(),
            findOne: jest.fn(),
            promoteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should be able to register user', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValueOnce({
        message: 'Registration Completed Successfully!',
      });

      const signUpParams: SignUpAuthDto = {
        cpf: USER_ENTITY_MOCK.cpf,
        name: USER_ENTITY_MOCK.name,
        email: USER_ENTITY_MOCK.email,
        gender: USER_ENTITY_MOCK.gender,
        whatsapp: USER_ENTITY_MOCK.whatsapp,
        password: USER_PASSWORD,
        date_of_birth: USER_ENTITY_MOCK.date_of_birth,
        password_confirmation: USER_PASSWORD,
      }

      expect(
          await controller.signUp(signUpParams),
      ).toEqual({ message: 'Registration Completed Successfully!' });
    });
  });

  describe('signIn', () => {
    it('should be logged in', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValueOnce({
        token: 'token',
        message: 'Authentication Successfully!',
      });

      expect(
          await controller.signIn({
            email: USER_ENTITY_MOCK.email,
            password: USER_PASSWORD,
          }),
      ).toEqual({ token: 'token', message: 'Authentication Successfully!' });
    });
  });

  describe('findOne', () => {
    it('should be able to find user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
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
        deleted_at: USER_ENTITY_MOCK.deleted_at,
      });

      expect(
          await controller.findOne(USER_ENTITY_MOCK, USER_ENTITY_MOCK.id),
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

  describe('me', () => {
    it('should be able to find user', async () => {
      jest.spyOn(service, 'me').mockResolvedValueOnce({
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
        deleted_at: USER_ENTITY_MOCK.deleted_at,
      });

      expect(await controller.getMe(USER_ENTITY_MOCK)).toEqual({
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

  describe('promoteUser', () => {
    it('should be able to promote user', async () => {
      jest.spyOn(service, 'promoteUser').mockResolvedValueOnce({
        user: {
          id: USER_ENTITY_MOCK.id,
          cpf: USER_ENTITY_MOCK.cpf,
          role: ERole.ADMIN,
          name: USER_ENTITY_MOCK.name,
          email: USER_ENTITY_MOCK.email,
          status: USER_ENTITY_MOCK.status,
          gender: USER_ENTITY_MOCK.gender,
          whatsapp: USER_ENTITY_MOCK.whatsapp,
          date_of_birth: USER_ENTITY_MOCK.date_of_birth,
          created_at: USER_ENTITY_MOCK.created_at,
          updated_at: USER_ENTITY_MOCK.updated_at,
          deleted_at: USER_ENTITY_MOCK.deleted_at,
        },
        valid: true,
        message: 'User promoted successfully!',
      });

      expect(
          await controller.promoteUser(USER_ENTITY_MOCK.id, {
            ...USER_ENTITY_MOCK,
            role: ERole.ADMIN,
          }),
      ).toEqual({
        user: {
          id: USER_ENTITY_MOCK.id,
          cpf: USER_ENTITY_MOCK.cpf,
          role: ERole.ADMIN,
          name: USER_ENTITY_MOCK.name,
          email: USER_ENTITY_MOCK.email,
          status: USER_ENTITY_MOCK.status,
          gender: USER_ENTITY_MOCK.gender,
          whatsapp: USER_ENTITY_MOCK.whatsapp,
          date_of_birth: USER_ENTITY_MOCK.date_of_birth,
          created_at: USER_ENTITY_MOCK.created_at,
          updated_at: USER_ENTITY_MOCK.updated_at,
          deleted_at: USER_ENTITY_MOCK.deleted_at,
        },
        valid: true,
        message: 'User promoted successfully!',
      });
    });
  });

  describe('update', () => {
    it('should be able to update user', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce({
        message: 'Update Successfully!',
      });

      expect(
          await controller.update(
              {
                name: 'Demi Moore',
                date_of_birth: new Date('2000-01-01'),
              },
              USER_ENTITY_MOCK,
          ),
      ).toEqual({ message: 'Update Successfully!' });
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
    it('should be able to upload file', async () => {
      jest.spyOn(service, 'upload').mockResolvedValueOnce({
        message: 'File uploaded successfully!',
      });
      expect(
          await controller.upload(
              mockFile,
              USER_ENTITY_MOCK,
          ),
      ).toEqual({ message: 'File uploaded successfully!' });
    });
  })
});
