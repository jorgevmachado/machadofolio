import { CreateIncomeSourceParams } from '@repo/business';

import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSourceDto implements CreateIncomeSourceParams {
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}