import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { snakeCaseToNormal } from '@repo/services/string/string';

import BillBusiness from '@repo/business/finance/bill/business/business';
import BillConstructor from '@repo/business/finance/bill/bill';

import { FilterParams, Service } from '../../shared';

import { Bank } from '../../entities/bank.entity';
import { Bill } from '../../entities/bill.entity';
import { BillCategory } from '../../entities/category.entity';
import { Expense } from '../../entities/expense.entity';
import { Finance } from '../../entities/finance.entity';

import { BankService } from './bank/bank.service';
import { CategoryService } from './category/category.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { CreateExpenseDto } from './expense/dto/create-expense.dto';
import { ExpenseService } from './expense/expense.service';
import { UpdateBillDto } from './dto/update-bill.dto';

type ExistExpenseInBill = {
  year?: number;
  nameCode: string;
  withThrow?: boolean;
  fallBackMessage?: string;
}

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
        return await this.customSave(updatedBill);
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
            if (withThrow) {
                throw new ConflictException(
                    `Key (name)=(${bill.name}) already exists with this (year)=(${bill.year}).`,
                );
            }
            return existBill;
        }
        const calculatedBill = this.billBusiness.calculate(bill);
        return await this.save(calculatedBill);
    }

    async remove(param: string) {
        const result = await this.findOne({
            value: param,
            relations: this.relations,
        }) as Bill;
        if (result?.expenses?.length) {
            throw this.error(
                new ConflictException(
                    'You cannot delete this bill because it is already in use.',
                ),
            );
        }
        await this.repository.softRemove(result);
        return { message: 'Successfully removed' };
    }

    async addExpense(param: string, createExpenseDto: CreateExpenseDto) {
        const bill = await this.findOne({ value: param }) as Bill;
        const createdExpense = await this.expenseService.buildForCreation(
            bill,
            createExpenseDto,
        );

        const existExpense = await this.existExpenseInBill({
            year: createdExpense.year,
            nameCode: createdExpense.name_code,
            withThrow: false,
        });


      const { type, value, month, instalment_number } = createExpenseDto;

      const {
        nextYear,
        requiresNewBill,
        monthsForNextYear,
        expenseForNextYear,
        expenseForCurrentYear,
      } = await this.expenseService.initialize({
        type,
        value,
        month,
        expense: !existExpense ? createdExpense : existExpense,
        instalment_number,
      });


        if (requiresNewBill && expenseForNextYear) {
            const newBill = (await this.createNewBillForNextYear(
                nextYear,
                bill,
            )) as Bill;

            const existingExpense = await this.existExpenseInBill({
                year: nextYear,
                nameCode: expenseForNextYear.name_code,
                withThrow: false,
            });

            await this.expenseService.addExpenseForNextYear(newBill, monthsForNextYear, expenseForNextYear, existingExpense);
        }

        return expenseForCurrentYear;
    }

  private async existExpenseInBill({
      year,
      nameCode,
      withThrow = true,
      fallBackMessage = 'You cannot add this expense because it is already in use.',
  }: ExistExpenseInBill) {
    const filters: Array<FilterParams> = [
      {
        value: nameCode,
        param: 'expenses.name_code',
        relation: true,
        condition: 'LIKE',
      },
    ];
    if (year) {
      filters.push({
        value: year,
        param: 'expenses.year',
        relation: true,
        condition: '=',
      });
    }

    const result = (await this.findAll({ filters })) as Array<Bill>;

    if (withThrow && result.length) {
      throw this.error(new ConflictException(fallBackMessage));
    }

    return result[0]?.expenses?.[0];
  }

    private async createNewBillForNextYear(year: number, bill: Bill) {
        const currentBill = new BillConstructor({
            ...bill,
            id: undefined,
            year,
            expenses: [],
        });
        return await this.customSave(currentBill, false);
    }
}
