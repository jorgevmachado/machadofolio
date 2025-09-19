import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { IncomeSource } from '../../entities/income-source.entity';

import { IncomeSourceService } from './source.service';
import { SourceController } from './source.controller';

@Module({
  imports: [
      TypeOrmModule.forFeature([IncomeSource]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SourceController],
  providers: [IncomeSourceService],
  exports: [IncomeSourceService]
})
export class SourceModule {}
