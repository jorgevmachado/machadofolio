import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { EMonth, TMonth } from '@repo/services';

import { PersistMonthParams } from '@repo/business';

import { Expense } from '../../entities/expense.entity';
import { Income } from '../../entities/incomes.entity';

export class PersistMonthDto implements PersistMonthParams {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    code?: number;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    value!: number;

    @IsOptional()
    @MaxLength(200)
    label?: TMonth;

    @IsOptional()
    @IsEnum(EMonth)
    month?: EMonth;

    @IsOptional()
    income?: Income;

    @IsOptional()
    expense?: Expense;

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
