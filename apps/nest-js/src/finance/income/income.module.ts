import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Income } from '../entities/incomes.entity';

import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

import { MonthModule } from '../month/month.module';
import { SourceModule } from './source/source.module';

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
