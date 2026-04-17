import { UpdateUserDto } from '../users/dto/update-user.dto';

import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuthDto extends PartialType(UpdateUserDto) {}
