import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ERole } from '@repo/business/enum';
import { QueryParameters } from '@repo/business/types';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthRoles } from '../../decorators/auth-role/auth-roles.decorator';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('finance/group')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @Get()
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Post()
  create(@Body() createBillCategoryDto: CreateGroupDto) {
    return this.service.create(createBillCategoryDto);
  }

  @Get(':param')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Put(':param')
  @AuthRoles(ERole.ADMIN)
  update(
      @Param('param') param: string,
      @Body() updateBillCategoryDto: UpdateGroupDto,
  ) {
    return this.service.update(param, updateBillCategoryDto);
  }

  @Delete(':param')
  @AuthRoles(ERole.ADMIN)
  remove(@Param('param') param: string) {
    return this.service.remove(param);
  }
}
