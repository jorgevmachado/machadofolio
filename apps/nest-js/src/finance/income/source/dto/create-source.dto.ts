import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateIncomeSourceParams } from '@repo/business';

export class CreateSourceDto implements CreateIncomeSourceParams {
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}