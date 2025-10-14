import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

import { EMonth } from '@repo/services';

import  { type CreateExpenseParams, EExpenseType } from '@repo/business';

import { IsNameDependingOnParent } from '../../../../decorators/name-depending-parent/name-depending-parent.decorator';

import { Supplier } from '../../../entities/supplier.entity';
import { Expense } from '../../../entities/expense.entity';
import { Transform } from 'class-transformer';

export class CreateExpenseDto implements CreateExpenseParams {
    @IsNotEmpty()
    @IsEnum(EExpenseType)
    type!: EExpenseType;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
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

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    instalment_number?: number | undefined;

    @IsOptional()
    parent?: string | Expense;

    @IsNameDependingOnParent()
    aggregate_name?:string;

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
