import { IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';

import { EMonth } from '@repo/services/date/month/enum';

import type { CreateExpenseParams } from '@repo/business/finance/expense/types';
import { EExpenseType } from '@repo/business/finance/expense/enum';

import { Supplier } from '../../../entities/supplier.entity';

export class CreateExpenseDto implements CreateExpenseParams {
    @IsNotEmpty()
    @IsEnum(EExpenseType)
    type!: EExpenseType;

    @IsEmpty()
    @IsBoolean()
    paid?: boolean;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 0 })
    value?: number;

    @IsEmpty()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsNotEmpty()
    @MaxLength(200)
    supplier!: string | Supplier;

    @IsEmpty()
    @MaxLength(200)
    description?: string | undefined;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 0 })
    instalment_number?: number | undefined;
}
