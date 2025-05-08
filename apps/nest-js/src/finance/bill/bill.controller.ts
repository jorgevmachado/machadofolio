import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthRoleGuard } from '../../guards/auth-role/auth-role.guard';
import { AuthStatusGuard } from '../../guards/auth-status/auth-status.guard';
import { FinanceInitializeGuard } from '../../guards/finance-initialize/finance-initialize.guard';
import { GetUserAuth } from '../../decorators/auth-user/auth-user.decorator';

import { Finance } from '../../entities/finance.entity';
import { User } from '../../entities/user.entity';

import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';


@Controller('finance/bill')
@UseGuards(
    AuthGuard(),
    AuthRoleGuard,
    AuthStatusGuard,
    FinanceInitializeGuard,
)
export class BillController {
  constructor(private readonly service: BillService) {}

  @Post()
  create(@GetUserAuth() user: User, @Body() createBillDto: CreateBillDto) {
    return this.service.create(user.finance as Finance, createBillDto);
  }
}
