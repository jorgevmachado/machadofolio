import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { removeUndefinedFields, transformObjectDateAndNulls } from '@repo/services/object/object';

import AuthBusiness from '@repo/business/auth/business/business';
import { ERole } from '@repo/business/enum';

import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { User } from './entities/user.entity';
import { UsersService } from './users/users.service';


@Injectable()
export class AuthService {
    constructor(
        protected userService: UsersService,
        protected jwtService: JwtService,
        protected authBusiness: AuthBusiness,
    ) {
    }

    async signUp(signUpAuthDto: SignUpAuthDto) {
        await this.userService.create(signUpAuthDto);
        return { message: 'Registration Completed Successfully!' };
    }

    async signIn(signInAuthDto: SignInAuthDto) {
        return this.userService
            .checkCredentials(signInAuthDto)
            .then((response) => {
                const jwtPayload = {
                    id: response.id,
                    // finance: { id: response?.finance?.id },
                };
                const token = this.jwtService.sign(jwtPayload);

                return { message: 'Authentication Successfully!', token };
            });
    }

    async findOne(id: string, user: User) {
        const withDeleted = user.role === ERole.ADMIN;
        const currentUser = await this.userService.findOne({
            value: id,
            withDeleted,
        }) as User;
        return this.authBusiness.currentUser(currentUser, user);
    }

    async update(updateAuthDto: UpdateAuthDto, authUser: User) {
        const { id, role, status } = updateAuthDto;
        this.authBusiness.validateCurrentUser({ role, status, authUser });
        const currentId = this.authBusiness.getCurrentId(authUser, id);
        await this.userService.update(currentId, updateAuthDto);
        return { message: 'Update Successfully!' };
    }

    async me(user: User) {
        const currentUser = await this.userService.me(user.id);
        return removeUndefinedFields(currentUser);
    }

    async promoteUser(id: string, authUser: User) {
        this.authBusiness.validateCurrentUser({ authUser });
        const currentUser = await this.findOne(id, authUser);
        return this.userService.promote(currentUser);
    }

    async upload(file: Express.Multer.File, authUser: User) {
        const id = authUser.id;
        this.authBusiness.validateCurrentUser({ id, authUser });
        await this.userService.upload(id, file);
        return {
            message: 'File uploaded successfully!',
        };
    }

    async seed(userJson: unknown, password: string, withReturnSeed: boolean = true) {
        const user = transformObjectDateAndNulls<User, unknown>(userJson);
        const currentUser = (await this.userService.seed(user, password)) as User;
        if (withReturnSeed) {
            return currentUser;
        }
        return { message: 'Seeding Completed Successfully!' };
    }

    async seeds(listJson: Array<unknown>, password: string, withReturnSeed: boolean = true) {
        const currentListUser = (await this.userService.seeds(listJson, password)) as Array<User>;
        if (withReturnSeed) {
            return currentListUser;
        }
        return { message: 'Seeding list of user Completed Successfully!' };
    }
}
