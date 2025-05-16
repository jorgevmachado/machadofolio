import { IsEnum, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

import { CreateBillParams } from '@repo/business/finance/bill/types';
import { EBillType } from '@repo/business/finance/bill/enum';

import { Bank } from '../../entities/bank.entity';
import { BillCategory } from '../../entities/category.entity';


export class CreateBillDto implements CreateBillParams {
    @IsEnum(EBillType)
    type!: EBillType;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsNotEmpty()
    @MaxLength(200)
    bank!: string | Bank;

    @IsNotEmpty()
    @MaxLength(200)
    category!: string | BillCategory;
}
