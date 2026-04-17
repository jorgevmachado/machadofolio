import { IsNotEmpty, MaxLength } from 'class-validator';

import { type CreateGroupParams } from '@repo/business';

export class CreateGroupDto implements Pick<CreateGroupParams, 'name'>{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
