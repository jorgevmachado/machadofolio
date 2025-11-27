import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { transformObjectDateAndNulls } from '@repo/services';

import { ERole, EStatus, User as UserConstructor } from '@repo/business';

import USER_LIST_DEVELOPMENT_JSON from '../../../seeds/development/users.json';
import USER_LIST_STAGING_JSON from '../../../seeds/staging/users.json';
import USER_LIST_PRODUCTION_JSON from '../../../seeds/production/users.json';

import { SeedsGenerated, Service, type TBy } from '../../shared';

import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsUserDto } from './dto/credentials-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService extends Service<User>{
    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>,
    ) {
        super('users', ['finance'], repository);
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
            withThrow: false,
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

    async promote(user: User) {
        if (user.role === ERole.ADMIN) {
            return {
                user,
                valid: false,
                message: 'The User is already admin.',
            };
        }
        user.role = ERole.ADMIN;
        const newUser = (await this.save(user)) as User;
        const currentUser = new UserConstructor({...newUser, clean: true });
        return {
            user: currentUser,
            valid: true,
            message: 'User promoted successfully!',
        };
    }

    async upload(id: string, file: Express.Multer.File) {
        const currentUser = await this.findOne({ value: id }) as User;
        const path = await this.file.upload(file, currentUser.email);
        currentUser.avatar = `http://localhost:3001/uploads/${path.split('/').pop()}`;
        return await this.save(currentUser);
    }

    async me(id: string) {
        const currentUser = await this.findOne({
            value: id,
            withRelations: true,
        }) as User;
        return new UserConstructor({...currentUser, clean: true });
    }

    async seed(user: User, password: string) {
        console.info(`# => Start seeding ${user.name} User`);
        const item = user;

        const currentSeed = await this.queries.findBy({
            searchParams: {
                by: 'cpf',
                value: item.cpf,
                condition: '=',
            },
            withThrow: false,
            relations: this.relations,
        });

        if (currentSeed) {
            console.info(`# => No new ${'User'.toLowerCase()} to seed`);
            return new UserConstructor({...currentSeed, clean: true });
        }
        const currentUser = await this.create({
            cpf: item.cpf,
            name: item.name,
            email: item.email,
            gender: item.gender,
            whatsapp: item.whatsapp,
            password: password,
            date_of_birth: item.date_of_birth,
            password_confirmation: password,
        });
        const promotedUser = await this.promote(currentUser as User);
        console.info(`# => Seeded 1 new user`);
        const currentUserSeed = await this.findOne({
            value: promotedUser.user.id,
            relations: [],
        }) as User;
        return new UserConstructor({...currentUserSeed, clean: true });
    }

    async seeds(listJson: Array<unknown>, password: string) {
        const seeds = listJson.map((item) => transformObjectDateAndNulls<User, unknown>(item));
        return await Promise.all(seeds.map( async (item) => await this.seed(item, password)));
    }

    async generateSeed(withSeed: boolean): Promise<SeedsGenerated<User>> {
        const rootSeedsDir = this.file.getSeedsDirectory();
        return await this.generateEntitySeeds({
            staging: USER_LIST_STAGING_JSON,
            seedsDir: rootSeedsDir,
            withSeed,
            production: USER_LIST_PRODUCTION_JSON,
            development: USER_LIST_DEVELOPMENT_JSON,
            withRelations: true,
            filterGenerateEntityFn: (json, item) => json.cpf === item.cpf || json.email === item.email,
        });
    }

    async persistSeed(withSeed: boolean) {
        return await this.seeder.persistEntity({
            withSeed,
            staging: USER_LIST_STAGING_JSON,
            production: USER_LIST_PRODUCTION_JSON,
            development: USER_LIST_DEVELOPMENT_JSON,
        });
    }
}