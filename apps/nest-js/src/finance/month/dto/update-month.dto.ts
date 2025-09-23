import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { type UpdateMonthParams } from '@repo/business';

export class UpdateMonthDto implements UpdateMonthParams {

    @IsNotEmpty()
    @IsUUID()
    id!: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsNotEmpty()
    @IsNumber()
    code!: number;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    value!: number;

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