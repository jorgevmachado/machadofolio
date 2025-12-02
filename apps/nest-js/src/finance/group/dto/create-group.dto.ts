import { type CreateGroupParams } from '@repo/business';

import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupDto implements Pick<CreateGroupParams, 'name'>{
    @IsNotEmpty()
    @MaxLength(200)
    name!: string;
}
