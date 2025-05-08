import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { snakeCaseToNormal } from '@repo/services/string/string';

import BillConstructor from '@repo/business/finance/bill/bill';

import { Service } from '../../shared';

import { Bank } from '../../entities/bank.entity';
import { Bill } from '../../entities/bill.entity';
import { BillCategory } from '../../entities/category.entity';
import { Finance } from '../../entities/finance.entity';

import { CreateBillDto } from './dto/create-bill.dto';

import { BankService } from './bank/bank.service';
import { CategoryService } from './category/category.service';
import { ExpenseService } from './expense/expense.service';

@Injectable()
export class BillService extends Service<Bill> {
  constructor(
      @InjectRepository(Bill)
      protected repository: Repository<Bill>,
      protected readonly bankService: BankService,
      protected readonly categoryService: CategoryService,
      protected readonly expenseService: ExpenseService,
  ) {
    super(
        'bills',
        ['bank', 'category', 'finance', 'expenses', 'expenses.supplier'],
        repository,
    );
  }

  async create(finance: Finance, createBillDto: CreateBillDto) {
    const bank = await this.bankService.treatEntityParam<Bank>(
        createBillDto.bank,
        'Bank'
    ) as Bank;

    const category = await this.categoryService.treatEntityParam<BillCategory>(
        createBillDto.category,
        'Bill Category'
    ) as BillCategory;

    const name = `${category.name} ${snakeCaseToNormal(createBillDto.type)}`;

    const bill = new BillConstructor({
      name,
      year: createBillDto.year,
      type: createBillDto.type,
      finance,
      bank,
      category,
    })

    return await this.customSave(bill);
  }

  private async customSave(bill: Bill, withThrow = true) {
    const existBill = await this.findOne({
      value: bill.name,
      filters: [{
        value: bill.year,
        param: 'year',
        condition: '='
      }]
    });
    if (existBill) {
      if(withThrow) {
        throw new ConflictException(
            `Key (name)=(${bill.name}) already exists with this (year)=(${bill.year}).`,
        );
      }
      return existBill;
    }

    return await this.save(bill);
  }
}
