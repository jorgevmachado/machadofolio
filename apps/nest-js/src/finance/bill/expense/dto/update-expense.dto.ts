import { IsBoolean, IsEnum, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { EExpenseType, type UpdateExpenseParams } from '@repo/business';

import { Supplier } from '../../../entities/supplier.entity';

export class UpdateExpenseDto implements UpdateExpenseParams{
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
    @IsNumber({ maxDecimalPlaces: 2 })
    january?: number;

    @IsBoolean()
    @IsOptional()
    january_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    february?: number;

    @IsBoolean()
    @IsOptional()
    february_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    march?: number;

    @IsBoolean()
    @IsOptional()
    march_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    april?: number;

    @IsBoolean()
    @IsOptional()
    april_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    may?: number;

    @IsBoolean()
    @IsOptional()
    may_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    june?: number;

    @IsBoolean()
    june_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    july?: number;

    @IsBoolean()
    @IsOptional()
    july_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    august?: number;

    @IsBoolean()
    @IsOptional()
    august_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    september?: number;

    @IsBoolean()
    @IsOptional()
    september_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    october?: number;

    @IsBoolean()
    @IsOptional()
    october_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    november?: number;

    @IsBoolean()
    @IsOptional()
    november_paid?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    december?: number;

    @IsBoolean()
    @IsOptional()
    december_paid?: boolean;
}
