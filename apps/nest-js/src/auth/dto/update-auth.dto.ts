import { PartialType } from '@nestjs/mapped-types';

import { UpdateUserDto } from '../users/dto/update-user.dto';

export class UpdateAuthDto extends PartialType(UpdateUserDto) {}
