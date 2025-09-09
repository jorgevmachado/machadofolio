import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ERole, type QueryParameters } from '@repo/business';

import { ListParams } from '../../shared';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthRoles } from '../../decorators/auth-role/auth-roles.decorator';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import { FinanceInitializeGuard } from '../../guards/finance-initialize/finance-initialize.guard';
import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';

import { User } from '../../auth/entities/user.entity';

import { Finance } from '../entities/finance.entity';

import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('finance')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard, FinanceInitializeGuard)
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @Get('/list/group')
  findAll(@GetUserAuth() user: User, @Query() parameters: QueryParameters) {
    const finance = user.finance as Finance;
    const filters: ListParams['filters'] = [{
      value: finance.id,
      param: 'finance',
      condition: '='
    }]
    return this.service.findAll({ parameters, filters });
  }

  @Post('/group')
  create(@GetUserAuth() user: User, @Body() createBillCategoryDto: CreateGroupDto) {
    return this.service.create(user.finance as Finance, createBillCategoryDto);
  }

  @Get(':param/group')
  findOne(@GetUserAuth() user: User, @Param('param') param: string) {
    const finance = user.finance as Finance;
    const filters: ListParams['filters'] = [{
      value: finance.id,
      param: 'finance',
      condition: '='
    }]
    return this.service.findOne({ value: param, filters });
  }

  @Put(':param/group')
  @AuthRoles(ERole.ADMIN)
  update(
      @GetUserAuth() user: User,
      @Param('param') param: string,
      @Body() updateBillCategoryDto: UpdateGroupDto,
  ) {
    return this.service.update(user.finance as Finance,param, updateBillCategoryDto);
  }

  @Delete(':param/group')
  @AuthRoles(ERole.ADMIN)
  remove(@GetUserAuth() user: User,@Param('param') param: string) {
    const finance = user.finance as Finance;
    const filters: ListParams['filters'] = [{
      value: finance.id,
      param: 'finance',
      condition: '='
    }];
    return this.service.remove(param, filters);
  }
}
