import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import BillBusiness from '@repo/business/finance/bill/business/business';

import { Bill } from '../entities/bill.entity';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';

import { BankModule } from './bank/bank.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  controllers: [BillController],
  providers: [BillService, BillBusiness],
  imports: [
    TypeOrmModule.forFeature([Bill]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
      BankModule,
      CategoryModule,
      ExpenseModule,
  ],
  exports: [BillService]
})
export class BillModule {}
