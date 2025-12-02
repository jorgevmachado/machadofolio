import { CreateBankParams } from '@repo/business/finance/bank/types';

import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBankDto implements CreateBankParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
