import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { generateUUID } from '@repo/services/UUID/UUID';

import AuthBusiness from '@repo/business/auth/business/business';

import { AuthJwtStrategy } from '../strategies/auth-jwt/auth-jwt.strategy';

import { User } from './users/entities/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthJwtStrategy, AuthBusiness],
  imports: [
      UsersModule,
      TypeOrmModule.forFeature([User]),
      MulterModule.register({ storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${generateUUID()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        }
      }), limits: {
        fileSize: 2 * 1024 * 1024,
      } }),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: 'super-secret',
        signOptions: { expiresIn: '1d' },
      }),
  ],
  exports: [
      AuthService,
      AuthJwtStrategy,
      PassportModule
  ],
})
export class AuthModule {}
