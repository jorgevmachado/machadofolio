import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import UserConstructor from '@repo/business/auth/user/user';

import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  async create({
                 cpf,
                 name,
                 email,
                 gender,
                 whatsapp,
                 password,
                 date_of_birth
}: CreateUserDto) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const confirmation_token = crypto.randomBytes(32).toString('hex');
      const user = new UserConstructor({
          cpf,
          salt,
          name,
          email,
          gender,
          whatsapp,
          password,
          date_of_birth,
          confirmation_token,
      });
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
