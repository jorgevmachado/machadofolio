import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QueryParameters } from '@repo/business/types';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import { FinanceInitializeGuard } from '../../guards/finance-initialize/finance-initialize.guard';
import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';

import { Finance } from '../../entities/finance.entity';
import { ListParams } from '../../shared';
import { User } from '../../entities/user.entity';

import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { UpdateBillDto } from './dto/update-bill.dto';


@Controller('finance/bill')
@UseGuards(
    AuthGuard(),
    AuthRoleGuard,
    AuthStatusGuard,
    FinanceInitializeGuard,
)
export class BillController {
  constructor(private readonly service: BillService) {
  }

  @Get()
  findAll(@GetUserAuth() user: User, @Query() parameters: QueryParameters) {
    const finance = user.finance as Finance;
    const filters: ListParams['filters'] = [{
      value: finance.id,
      param: 'finance',
      condition: '='
    }]
    return this.service.findAll({ parameters, filters });
  }

  @Post()
  create(@GetUserAuth() user: User, @Body() createBillDto: CreateBillDto) {
    return this.service.create(user.finance as Finance, createBillDto);
  }

  @Put(':param')
  update(
      @GetUserAuth() user: User,
      @Param('param') param: string,
      @Body() updateBillDto: UpdateBillDto,
  ) {
    return this.service.update(user.finance as Finance, param, updateBillDto);
  }

  @Get(':param')
  findOne(@Param('param') param: string) {
    return this.service.findOne({ value: param });
  }

  @Delete(':param')
  remove(@Param('param') param: string) {
    return this.service.remove(param);
  }

  @Post(':param/expense')
  addExpense(@Param('param') param: string, @Body() createExpenseDto: CreateExpenseDto) {
    return this.service.addExpense(param, createExpenseDto);
  }

  @Get(':param/expense/:expenseId')
  findOneExpense(@Param('param') param: string, @Param('expenseId') expenseId: string) {
    return this.service.findOneExpense(param, expenseId);
  }

  @Get(':param/list/expense')
  findAllExpense(@Param('param') param: string, @Query() parameters: QueryParameters) {
    return this.service.findAllExpense(param, { parameters });
  }

  @Delete(':param/expense/:expenseId')
  removeExpense(@Param('param') param: string, @Param('expenseId') expenseId: string) {
    return this.service.removeExpense(param, expenseId);
  }
}
