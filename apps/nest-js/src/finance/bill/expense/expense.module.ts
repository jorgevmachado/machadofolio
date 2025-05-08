import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Expense } from '../../../entities/expense.entity';
import { ExpenseService } from './expense.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
