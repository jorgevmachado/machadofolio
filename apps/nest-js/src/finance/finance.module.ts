import { BankModule } from './bank/bank.module';
import { BillModule } from './bill/bill.module';
import { Finance } from './entities/finance.entity';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { GroupModule } from './group/group.module';
import { IncomeModule } from './income/income.module';
import { MonthModule } from './month/month.module';
import { SupplierModule } from './supplier/supplier.module';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [FinanceController],
    providers: [FinanceService],
    imports: [
        TypeOrmModule.forFeature([Finance]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        BankModule,
        BillModule,
        GroupModule,
        SupplierModule,
        IncomeModule,
        MonthModule
    ],
    exports: [FinanceService]
})
export class FinanceModule {}