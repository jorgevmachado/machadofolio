import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { EMonth } from '@repo/services/index';

import { CreateMonthParams } from '@repo/business/index';

export class MonthDto implements CreateMonthParams {
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    value!: number;

    @IsOptional()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsOptional()
    @Transform(({ value }) => {
        if (!value || isNaN(Date.parse(value as string))) {
            throw new Error("Invalid date format");
        }
        return new Date(value as string);
    })
    @IsDate()
    received_at?: Date;
}
