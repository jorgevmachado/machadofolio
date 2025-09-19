import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Income } from '../entities/incomes.entity';

import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';

import { SourceModule } from './source/source.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Income]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      SourceModule
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService]
})
export class IncomeModule {}
