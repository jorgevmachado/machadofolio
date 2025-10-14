import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseBusiness } from '@repo/business';

import { Expense } from '../../entities/expense.entity';
import { MonthModule } from '../../month/month.module';
import { SupplierModule } from '../../supplier/supplier.module';

import { ExpenseService } from './expense.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SupplierModule,
    MonthModule
  ],
  providers: [ExpenseService, ExpenseBusiness],
  exports: [ExpenseService],
})
export class ExpenseModule {
}
