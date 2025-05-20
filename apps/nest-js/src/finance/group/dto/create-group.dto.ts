import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateGroupParams } from '@repo/business/finance/group/types';

export class CreateGroupDto implements CreateGroupParams{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
