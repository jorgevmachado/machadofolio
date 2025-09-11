import { IsDate, IsEnum, IsOptional, MaxDate, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { EGender } from '@repo/services';

import { ERole, EStatus, UpdateParams } from '@repo/business';

export class UpdateUserDto implements UpdateParams {
    @IsOptional()
    id?: string;

    @IsOptional()
    @IsEnum(ERole)
    role?: ERole;

    @IsOptional()
    @MaxLength(200)
    name?: string;

    @IsOptional()
    @IsEnum(EGender)
    gender?: EGender;

    @IsOptional()
    @IsEnum(EStatus)
    status?: EStatus;

    @IsOptional()
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
