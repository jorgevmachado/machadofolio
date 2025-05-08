import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateBillCategoryParams } from '@repo/business/finance/bill-category/types';

export class CreateCategoryDto implements CreateBillCategoryParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
