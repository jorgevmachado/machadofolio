import { IsNotEmpty, MaxLength } from 'class-validator';

import { type CreateSupplierParams } from '@repo/business';

import { SupplierType } from '../../entities/type.entity';

export class CreateSupplierDto implements  CreateSupplierParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @MaxLength(200)
    type!: string | SupplierType;
}
