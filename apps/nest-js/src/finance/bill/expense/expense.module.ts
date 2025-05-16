import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import ExpenseBusiness from '@repo/business/finance/expense/business/business';

import { Expense } from '../../entities/expense.entity';
import { ExpenseService } from './expense.service';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SupplierModule
  ],
  providers: [ExpenseService, ExpenseBusiness],
  exports: [ExpenseService],
})
export class ExpenseModule {
}
