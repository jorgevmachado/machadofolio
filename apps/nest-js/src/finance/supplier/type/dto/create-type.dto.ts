import { IsNotEmpty, MaxLength } from 'class-validator';

import { type CreateSupplierTypeParams } from '@repo/business';

export class CreateTypeDto implements CreateSupplierTypeParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
