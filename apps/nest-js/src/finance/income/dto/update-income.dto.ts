import { IsArray, IsNumber, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { type UpdateIncomeParams } from '@repo/business';

import { IncomeSource } from '../../entities/income-source.entity';
import { UpdateMonthDto } from '../../month/dto/update-month.dto';

export class UpdateIncomeDto implements UpdateIncomeParams {
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsOptional()
    @MaxLength(200)
    name?: string;

    @IsOptional()
    @MaxLength(200)
    source?: string | IncomeSource;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMonthDto)
    months?: Array<UpdateMonthDto>;

    @IsOptional()
    @MaxLength(200)
    description?: string;
}
