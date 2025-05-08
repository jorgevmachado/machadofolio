import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillModule } from './bill/bill.module';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

import { Finance } from '../entities/finance.entity';

@Module({
    controllers: [FinanceController],
    providers: [FinanceService],
    imports: [
        TypeOrmModule.forFeature([Finance]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        BillModule,
    ],
    exports: [FinanceService]
})
export class FinanceModule {
}
