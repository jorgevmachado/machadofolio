import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bank } from './entities/bank.entity';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Bank]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
