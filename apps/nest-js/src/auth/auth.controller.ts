import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { GetUserAuth } from '../decorators/auth-user/auth-user.decorator';
import { UseFileUpload } from '../decorators/use-file-upload/use-file-upload.decorator';

import { AuthRoleGuard } from '../guards/auth-role/auth-role.guard';

import { User } from './entities/user.entity';

import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signUp')
  signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }

  @Post('signIn')
  signIn(@Body() signInAuthDto: SignInAuthDto) {
    return this.authService.signIn(signInAuthDto);
  }

  @Get('me')
  @UseGuards(AuthGuard(), AuthRoleGuard)
  getMe(@GetUserAuth() user: User) {
    return this.authService.me(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), AuthRoleGuard)
  findOne(@GetUserAuth() user: User, @Param('id') id: string) {
    return this.authService.findOne(id, user);
  }

  @Put(':id/promote')
  @UseGuards(AuthGuard(), AuthRoleGuard)
  promoteUser(@Param('id') id: string, @GetUserAuth() user: User) {
    return this.authService.promoteUser(id, user);
  }

  @Put('update')
  @UseGuards(AuthGuard(), AuthRoleGuard)
  update(
      @Body() updateAuthDto: UpdateAuthDto,
      @GetUserAuth() user: User,
  ) {
    return this.authService.update(updateAuthDto, user);
  }

  @Put('upload')
  @UseGuards(AuthGuard(), AuthRoleGuard)
  @UseFileUpload(['image/jpeg', 'image/png', 'image/jpg'])
  async upload(
      @UploadedFile() file: Express.Multer.File,
      @GetUserAuth() user: User,
  ) {
    return await this.authService.upload(file, user);
  }
}