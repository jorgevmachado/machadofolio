import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateSupplierParams } from '@repo/business/finance/supplier/types';

import { SupplierType } from '../../entities/type.entity';


export class CreateSupplierDto implements  CreateSupplierParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @MaxLength(200)
    type!: string | SupplierType;
}
