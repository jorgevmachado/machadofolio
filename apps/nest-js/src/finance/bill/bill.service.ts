import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../../shared';

import { Bill } from '../../entities/bill.entity';

@Injectable()
export class BillService extends Service<Bill> {
  constructor(
      @InjectRepository(Bill)
      protected repository: Repository<Bill>,
  ) {
    super(
        'bills',
        ['bank', 'category', 'finance', 'expenses', 'expenses.supplier'],
        repository,
    );
  }
}
