import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, MaxLength } from 'class-validator';

import { EMonth } from '@repo/services';

import  { type CreateExpenseParams, EExpenseType } from '@repo/business';

import { IsNameDependingOnParent } from '../../../../decorators/name-depending-parent/name-depending-parent.decorator';

import { Supplier } from '../../../entities/supplier.entity';

export class CreateExpenseDto implements CreateExpenseParams {
    @IsNotEmpty()
    @IsEnum(EExpenseType)
    type!: EExpenseType;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 0 })
    value?: number;

    @IsOptional()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsNotEmpty()
    @MaxLength(200)
    supplier!: string | Supplier;

    @IsOptional()
    @MaxLength(200)
    description?: string | undefined;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 0 })
    instalment_number?: number | undefined;

    @IsOptional()
    parent?: string;

    @IsNameDependingOnParent()
    aggregate_name?:string;
}
