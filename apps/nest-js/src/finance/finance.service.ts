import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Service } from '../shared';

import { Finance } from './entities/finance.entity';

import { BankService } from './bank/bank.service';
import { BillService } from './bill/bill.service';
import { SupplierService } from './supplier/supplier.service';


@Injectable()
export class FinanceService extends Service<Finance> {
  constructor(
      @InjectRepository(Finance)
      protected repository: Repository<Finance>,
      protected readonly supplierService: SupplierService,
      protected readonly bankService: BankService,
      protected readonly billService: BillService,
  ) {
    super('finances', [], repository);
  }
}
