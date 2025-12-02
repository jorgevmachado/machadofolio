import { CreateBillParams, EBillType } from '@repo/business';

import { Bank } from '../../entities/bank.entity';
import { Group } from '../../entities/group.entity';

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';


export class CreateBillDto implements CreateBillParams {
    @IsEnum(EBillType)
    type!: EBillType;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0 })
    year?: number;

    @IsNotEmpty()
    @MaxLength(200)
    bank!: string | Bank;

    @IsNotEmpty()
    @MaxLength(200)
    group!: string | Group;
}
