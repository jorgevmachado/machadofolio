import { SignInParams } from '@repo/business/auth/types';

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CredentialsUserDto implements SignInParams {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
