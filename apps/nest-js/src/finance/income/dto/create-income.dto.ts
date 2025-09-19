import { IsDate, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { type CreateIncomeParams } from '@repo/business';

import { IncomeSource } from '../../entities/income-source.entity';

export class CreateIncomeDto implements CreateIncomeParams {

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    total!: number;

    @IsNotEmpty()
    @MaxLength(200)
    source!: string | IncomeSource;

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (!value || isNaN(Date.parse(value as string))) {
            throw new Error("Invalid date format");
        }
        return new Date(value as string);
    })
    @IsDate()
    received_at!: Date;

    @IsOptional()
    @MaxLength(200)
    description?: string | undefined;
}
