import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    MaxDate,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { EGender } from '@repo/services/personal-data/enum';

import { SignUpParams } from '@repo/business/auth/types';

import { CPF } from '../../../decorators/cpf/cpf.decorator';
import { Match } from '../../../decorators/match/match.decorator';

export class CreateUserDto implements SignUpParams{
    @IsNotEmpty()
    @CPF()
    cpf!: string;

    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @MaxLength(200)
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsEnum(EGender)
    gender!: EGender;

    @MaxLength(11)
    @MinLength(11)
    @IsNotEmpty()
    whatsapp!: string;

    @IsNotEmpty()
    @MinLength(6)
    password!: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value || isNaN(Date.parse(value as string))) {
            throw new Error("Invalid date format");
        }
        return new Date(value as string);
    })
    @IsDate()
    @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
        message: 'You must be over 18 years old',
    })
    date_of_birth!: Date;

    @IsNotEmpty()
    @MinLength(6)
    @Match('password')
    password_confirmation!: string;
}
