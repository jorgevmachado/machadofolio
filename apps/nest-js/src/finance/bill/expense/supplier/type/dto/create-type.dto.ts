import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateSupplierTypeParams } from '@repo/business/finance/supplier-type/types';

export class CreateTypeDto implements CreateSupplierTypeParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
