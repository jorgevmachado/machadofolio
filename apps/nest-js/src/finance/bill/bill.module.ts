import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillBusiness } from '@repo/business';

import { BankModule } from '../bank/bank.module';
import { Bill } from '../entities/bill.entity';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { ExpenseModule } from './expense/expense.module';
import { GroupModule } from '../group/group.module';

@Module({
  controllers: [BillController],
  providers: [BillService, BillBusiness],
  imports: [
    TypeOrmModule.forFeature([Bill]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
      BankModule,
      GroupModule,
      ExpenseModule,
  ],
  exports: [BillService]
})
export class BillModule {}
