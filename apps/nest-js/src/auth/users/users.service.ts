import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ERole, EStatus } from '@repo/business/enum';
import { USER_ENTITY_MOCK, USER_PASSWORD } from '@repo/business/auth/mock/mock';
import UserConstructor from '@repo/business/auth/user/user';

import { Service, type TBy } from '../../shared';

import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsUserDto } from './dto/credentials-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';




@Injectable()
export class UsersService extends Service<User>{
    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>,
    ) {
        super('users', [], repository);
    }
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
          password: hashPassword,
          date_of_birth,
          confirmation_token,
      });
      await this.hasInactiveUser('cpf', user.cpf);
      await this.hasInactiveUser('email', user.email);
      await this.hasInactiveUser('whatsapp', user.whatsapp);
      return await this.save(user as User);
  }

    private async hasInactiveUser(by: TBy, value: string) {
        const entity = await this.queries.findBy({
            searchParams: {
                by,
                value,
            },
            withDeleted: true,
        });

        if (entity && entity.deleted_at !== null) {
            throw new BadRequestException(
                'Inactive user, please contact administrator.',
            );
        }
    }

    async update(
        id: string,
        { role, name, gender, status, date_of_birth }: UpdateUserDto,
    ) {
        const currentUser = await this.findOne({ value: id }) as User;

        if (!role && !name && !gender && !status && !date_of_birth) {
            return currentUser;
        }

        currentUser.role = !role ? currentUser.role : role;
        currentUser.name = !name ? currentUser.name : name;
        currentUser.gender = !gender ? currentUser.gender : gender;
        currentUser.status = !status ? currentUser.status : status;
        currentUser.date_of_birth = !date_of_birth
            ? currentUser.date_of_birth
            : date_of_birth;

        return await this.save(currentUser);
    }

    async checkCredentials({ email, password }: CredentialsUserDto) {
        const user = await this.queries.findBy({
            searchParams: {
                by: 'email',
                value: email,
            },
        });

        if (!user || user?.status === EStatus.INACTIVE) {
            throw new UnprocessableEntityException('Inactive User');
        }

        const hash = await bcrypt.hash(password, user.salt as string);

        if (hash === user.password) {
            return user;
        }

        throw new UnprocessableEntityException('Invalid credentials');
    }

    async promoteUser(user: User) {
        if (user.role === ERole.ADMIN) {
            return {
                user,
                valid: false,
                message: 'The User is already admin.',
            };
        }
        user.role = ERole.ADMIN;
        const newUser = (await this.save(user)) as User;
        return {
            user: newUser,
            valid: true,
            message: 'User promoted successfully!',
        };
    }

    async upload(id: string, file: Express.Multer.File) {
        const currentUser = await this.findOne({ value: id }) as User;
        const path = await this.file.upload(file, currentUser.email);
        currentUser.picture = `http://localhost:3001/uploads/${path.split('/').pop()}`;
        return await this.save(currentUser);
    }

    async seed() {
        console.info('# => Start seeding User');
        const item = USER_ENTITY_MOCK;

        const currentSeed = await this.queries.findBy({
            searchParams: {
                by: 'cpf',
                value: item.cpf,
                condition: '=',
            },
            relations: this.relations,
        });

        if (currentSeed) {
            console.info(`# => No new ${'User'.toLowerCase()} to seed`);
            return currentSeed;
        }
        const currentUser = await this.create({
            cpf: item.cpf,
            name: item.name,
            email: item.email,
            gender: item.gender,
            whatsapp: item.whatsapp,
            password: USER_PASSWORD,
            date_of_birth: item.date_of_birth,
            password_confirmation: USER_PASSWORD,
        });
        const promotedUser = await this.promoteUser(currentUser as User);
        console.info(`# => Seeded 1 new user`);
        return await this.findOne({
            value: promotedUser.user.id,
            relations: [],
        });
    }
}
