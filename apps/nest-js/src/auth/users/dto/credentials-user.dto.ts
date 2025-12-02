import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { SignInParams } from '@repo/business/auth/types';

export class CredentialsUserDto implements SignInParams {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
