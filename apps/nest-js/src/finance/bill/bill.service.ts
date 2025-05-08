import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { snakeCaseToNormal } from '@repo/services/string/string';

import BillBusiness from '@repo/business/finance/bill/business/business';
import BillConstructor from '@repo/business/finance/bill/bill';

import { Service } from '../../shared';

import { Bank } from '../../entities/bank.entity';
import { Bill } from '../../entities/bill.entity';
import { BillCategory } from '../../entities/category.entity';
import { Expense } from '../../entities/expense.entity';
import { Finance } from '../../entities/finance.entity';

import { BankService } from './bank/bank.service';
import { CategoryService } from './category/category.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { ExpenseService } from './expense/expense.service';
import { UpdateBillDto } from './dto/update-bill.dto';


@Injectable()
export class BillService extends Service<Bill> {
  constructor(
      @InjectRepository(Bill)
      protected repository: Repository<Bill>,
      protected billBusiness: BillBusiness,
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

  async update(finance: Finance, param: string, updateBillDto: UpdateBillDto) {
    const result = await this.findOne({ value: param }) as Bill;

    const bank = !updateBillDto.bank
        ? result.bank
        : await this.bankService.treatEntityParam<Bank>(
            updateBillDto.bank,
            'Bank',
        ) as Bank;

    const category = !updateBillDto.category
        ? result.category
        : await this.categoryService.treatEntityParam<BillCategory>(
            updateBillDto.category,
            'Bill Category',
        ) as BillCategory;

    const expenses = !updateBillDto.expenses
        ? result.expenses
        : await Promise.all(
            await this.expenseService.treatEntitiesParams<Expense>(
                updateBillDto.expenses,
                'Expense',
            ),
        ) as Array<Expense>;

    const year = !updateBillDto.year ? result.year : updateBillDto.year;
    const type = !updateBillDto.type ? result.type : updateBillDto.type;
    const name =
        !updateBillDto.category && !updateBillDto.type
            ? result.name
            : `${category.name} ${snakeCaseToNormal(type)}`;

    const updatedBill = new BillConstructor({
      ...result,
      name,
      year,
      type,
      finance,
      bank,
      category,
      expenses
    });

    const bill = this.billBusiness.calculate(updatedBill);

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
