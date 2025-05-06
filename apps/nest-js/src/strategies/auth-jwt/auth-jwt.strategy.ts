import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';

import { User } from '../../auth/users/entities/user.entity';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
    ) {
        super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'super-secret' });
    }

    async validate(payload: { id: string; }) {
        const alias = 'users';
        // const user = await this.repository
        //     .createQueryBuilder(alias)
        //     .leftJoinAndSelect(`${alias}.finance`, 'finance')
        //     .leftJoinAndSelect('finance.bills', 'bills')
        //     .where(`${alias}.id = :id` , { id: payload.id })
        //     .getOne();

        const user = await this.repository
            .createQueryBuilder(alias)
            .where(`${alias}.id = :id` , { id: payload.id })
            .getOne();

        if (!user) {
            throw new UnauthorizedException('User not found!');
        }

        return user;
    }
}