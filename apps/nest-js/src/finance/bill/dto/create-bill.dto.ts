import { IsEnum, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

import { CreateBillParams, EBillType } from '@repo/business';

import { Bank } from '../../entities/bank.entity';
import { Group } from '../../entities/group.entity';


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
    group!: string | Group;
}
