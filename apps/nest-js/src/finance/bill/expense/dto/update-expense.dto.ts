import { IsArray, IsBoolean, IsEnum, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { EExpenseType, type UpdateExpenseParams } from '@repo/business';

import { Supplier } from '../../../entities/supplier.entity';

import { UpdateMonthDto } from '../../../month/dto/update-month.dto';

export class UpdateExpenseDto implements UpdateExpenseParams {
    @IsOptional()
    @IsEnum(EExpenseType)
    type?: EExpenseType;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    @MaxLength(200)
    supplier?: string | Supplier;

    @IsOptional()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMonthDto)
    months?: Array<UpdateMonthDto>;
}
