import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { EMonth } from '@repo/services';

import { type CreateIncomeParams } from '@repo/business';

import { IncomeSource } from '../../entities/income-source.entity';
import { MonthDto } from '../../month/dto/create-month.dto';

export class CreateIncomeDto implements CreateIncomeParams {

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    total?: number;

    @IsOptional()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MonthDto)
    months?: Array<MonthDto>

    @IsNotEmpty()
    @MaxLength(200)
    source!: string | IncomeSource;

    @IsOptional()
    @Transform(({ value }) => {
        if (!value || isNaN(Date.parse(value as string))) {
            throw new Error("Invalid date format");
        }
        return new Date(value as string);
    })
    @IsDate()
    received_at?: Date;

    @IsOptional()
    @MaxLength(200)
    description?: string | undefined;
}
