import { IsDate, IsEmpty, IsEnum, MaxDate, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { EGender } from '@repo/services/personal-data/enum';

import { ERole, EStatus } from '@repo/business/enum';

export class UpdateUserDto  {
    @IsEmpty()
    id?: string;

    @IsEmpty()
    @IsEnum(ERole)
    role?: ERole;

    @IsEmpty()
    @MaxLength(200)
    name?: string;

    @IsEmpty()
    @IsEnum(EGender)
    gender?: EGender;

    @IsEmpty()
    @IsEnum(EStatus)
    status?: EStatus;

    @IsEmpty()
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
    date_of_birth?: Date;
}
