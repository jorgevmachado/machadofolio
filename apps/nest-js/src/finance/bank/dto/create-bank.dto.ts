import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateBankParams } from '@repo/business/finance/bank/types';

export class CreateBankDto implements CreateBankParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
