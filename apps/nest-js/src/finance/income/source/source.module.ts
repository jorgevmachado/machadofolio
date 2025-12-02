import { IncomeSource } from '../../entities/income-source.entity';

import { SourceController } from './source.controller';
import { IncomeSourceService } from './source.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

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
