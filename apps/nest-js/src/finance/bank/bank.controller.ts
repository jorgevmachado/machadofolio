import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ERole, type QueryParameters } from '@repo/business';

import { AuthRoles } from '../../decorators/auth-role/auth-roles.decorator';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';

import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('finance')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard)
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get('/list/bank')
  findAll(@Query() parameters: QueryParameters) {
    return this.service.findAll({ parameters });
  }

  @Post('/bank')
  create(@Body() { name }: CreateBankDto) {
    return this.service.create({ name });
  }

  @Get(':param/bank')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Put(':param/bank')
  @AuthRoles(ERole.ADMIN)
  update(@Param('param') param: string, @Body() updateBank: UpdateBankDto) {
    return this.service.update(param, updateBank);
  }

  @Delete(':param/bank')
  @AuthRoles(ERole.ADMIN)
  remove(@Param('param') param: string) {
    return this.service.remove(param);
  }

}
