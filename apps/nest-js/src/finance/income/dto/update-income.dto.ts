import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, MaxLength, ValidateNested } from 'class-validator';

import { type UpdateIncomeParams } from '@repo/business';

import { IncomeSource } from '../../entities/income-source.entity';
import { PersistMonthDto } from '../../month/dto/persist-month.dto';

export class UpdateIncomeDto implements UpdateIncomeParams {
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsOptional()
    @MaxLength(200)
    name?: string;

    @IsOptional()
    source?: string | IncomeSource;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PersistMonthDto)
    months?: Array<PersistMonthDto>;

    @IsOptional()
    @MaxLength(200)
    description?: string;
}
