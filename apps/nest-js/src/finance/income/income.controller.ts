import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import type { QueryParameters } from '@repo/business';

import { ListParams } from '../../shared';

import { User } from '../../auth/entities/user.entity';

import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import { FinanceInitializeGuard } from '../../guards/finance-initialize/finance-initialize.guard';

import { Finance } from '../entities/finance.entity';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

import { IncomeService } from './income.service';

@Controller('finance/income')
@UseGuards(AuthGuard(), AuthRoleGuard, AuthStatusGuard, FinanceInitializeGuard)
export class IncomeController {
  constructor(private readonly service: IncomeService) {}

  @Post()
  create(@GetUserAuth() user: User, @Body() body: CreateIncomeDto) {
    return this.service.create(user.finance as Finance, body);
  }

  @Get()
  findAll(@GetUserAuth() user: User, @Query() parameters: QueryParameters) {
      const finance = user.finance as Finance;
      const filters: ListParams['filters'] = [{
          value: finance.id,
          param: 'finance',
          condition: '='
      }]
      return this.service.findAll({ parameters, filters, withRelations: Boolean(parameters?.withRelations) });
  }

  @Get(':param')
  findOne(@GetUserAuth() user: User, @Param('param') param: string) {
        const finance = user.finance as Finance;
        const filters: ListParams['filters'] = [{
            value: finance.id,
            param: 'finance',
            condition: '='
        }]
        return this.service.findOne({ value: param, filters, withRelations: true });
    }

  @Patch(':param')
  update(@GetUserAuth() user: User, @Param('param') param: string, @Body() body: UpdateIncomeDto) {
    return this.service.update(user.finance as Finance, param, body);
  }

  @Delete(':param')
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
