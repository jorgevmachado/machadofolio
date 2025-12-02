import { type CreateSupplierParams } from '@repo/business';

import { SupplierType } from '../../entities/type.entity';

import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSupplierDto implements  CreateSupplierParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @MaxLength(200)
    type!: string | SupplierType;
}
