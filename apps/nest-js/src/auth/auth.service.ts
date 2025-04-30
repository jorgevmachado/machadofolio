import { Injectable } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {

  constructor(
      protected userService: UsersService
  ) {}
  async signUp(createUserDto: CreateAuthDto) {
    await this.userService.create(createUserDto);
    return { message: 'Registration Completed Successfully!' };
  }
}
