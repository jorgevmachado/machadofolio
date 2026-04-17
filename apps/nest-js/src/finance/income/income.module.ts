import { Income } from '../entities/incomes.entity';
import { MonthModule } from '../month/month.module';

import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { SourceModule } from './source/source.module';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forFeature([Income]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      SourceModule,
      MonthModule
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService]
})
export class IncomeModule {}
