import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bill } from './entities/bill.entity';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  controllers: [BillController],
  providers: [BillService],
  imports: [
    TypeOrmModule.forFeature([Bill]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
      CategoryModule,
      ExpenseModule,
  ],
  exports: [BillService]
})
export class BillModule {}
