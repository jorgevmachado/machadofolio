import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../../auth/entities/user.entity';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

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
        const user = await this.repository
            .createQueryBuilder(alias)
            .leftJoinAndSelect(`${alias}.finance`, 'finance')
            .leftJoinAndSelect('finance.bills', 'bills')
            .leftJoinAndSelect(`${alias}.pokemon_trainer`, 'pokemon_trainer')
            .leftJoinAndSelect('pokemon_trainer.captured_pokemons', 'captured_pokemons')
            .leftJoinAndSelect('pokemon_trainer.pokedex', 'pokedex')
            .where(`${alias}.id = :id` , { id: payload.id })
            .getOne();

        if (!user) {
            throw new UnauthorizedException('User not found!');
        }

        return user;
    }
}