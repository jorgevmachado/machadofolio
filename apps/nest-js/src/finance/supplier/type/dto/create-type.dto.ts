import { type CreateSupplierTypeParams } from '@repo/business';

import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTypeDto implements CreateSupplierTypeParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
