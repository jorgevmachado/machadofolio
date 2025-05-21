import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateGroupParams } from '@repo/business/finance/group/types';

export class CreateGroupDto implements Pick<CreateGroupParams, 'name'>{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
