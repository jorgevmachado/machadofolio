import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../../shared';

import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpenseService extends Service<Expense> {
  constructor(
      @InjectRepository(Expense)
      protected repository: Repository<Expense>,
  ) {
    super('expenses', ['supplier', 'bill'], repository);
  }
}
