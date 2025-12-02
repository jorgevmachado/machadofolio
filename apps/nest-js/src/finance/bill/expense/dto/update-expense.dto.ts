import { EExpenseType, type UpdateExpenseParams } from '@repo/business';

import { Supplier } from '../../../entities/supplier.entity';
import { PersistMonthDto } from '../../../month/dto/persist-month.dto';

import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, MaxLength, ValidateNested } from 'class-validator';

export class UpdateExpenseDto implements UpdateExpenseParams {
    @IsOptional()
    @IsEnum(EExpenseType)
    type?: EExpenseType;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    supplier?: string | Supplier;

    @IsOptional()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PersistMonthDto)
    months?: Array<PersistMonthDto>;
}