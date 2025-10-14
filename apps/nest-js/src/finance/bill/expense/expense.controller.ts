import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QueryParameters } from '@repo/business';

import { AuthRoleGuard } from '../../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../../guards/auth-status/auth-status.guard';
import { FinanceInitializeGuard } from '../../../guards/finance-initialize/finance-initialize.guard';

import { ExpenseService } from './expense.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('finance/bill')
@UseGuards(
    AuthGuard(),
    AuthRoleGuard,
    AuthStatusGuard,
    FinanceInitializeGuard,
)
export class ExpenseController {
    constructor(private readonly service: ExpenseService) {}

    @Put('/expense/:param')
    updateExpense(
        @Param('param') param: string,
        @Body() updateExpenseDto: UpdateExpenseDto,
    ) {
        return this.service.update(param, updateExpenseDto);
    }

    @Get('/expense/:param')
    findOne(@Param('param') param: string) {
        return this.service.findOne({ value: param, withRelations: true });
    }

    @Get('/list/expense')
    findAllExpense(@Query() parameters: QueryParameters) {
        return this.service.findAll({ parameters, withRelations: Boolean(parameters?.withRelations) });
    }

    @Delete('/expense/:param')
    remove(@Param('param') param: string) {
        return this.service.remove(param);
    }
}