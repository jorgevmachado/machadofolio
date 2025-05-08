import { IsNotEmpty, MaxLength } from 'class-validator';

import { SupplierType } from '../../../../../entities/type.entity';

export class CreateSupplierDto {
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;

    @IsNotEmpty()
    @MaxLength(200)
    type!: string | SupplierType;
}
