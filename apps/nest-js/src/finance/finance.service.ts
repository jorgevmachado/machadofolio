import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import FinanceConstructor from '@repo/business/finance/finance';

import { Service } from '../shared';

import { Finance } from './entities/finance.entity';
import { User } from '../auth/entities/user.entity';

import { BillService } from './bill/bill.service';

@Injectable()
export class FinanceService extends Service<Finance> {
  constructor(
      @InjectRepository(Finance)
      protected repository: Repository<Finance>,
      protected readonly billService: BillService,
  ) {
    super('finances', [], repository);
  }

    async initialize(user: User) {
      if(user?.finance) {
        return {
          ...user.finance,
          user
        };
      }
      const finance = new FinanceConstructor({ user });
      return await this.save(finance);
    }
}
