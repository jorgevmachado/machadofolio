import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import ExpenseBusiness from '@repo/business/finance/expense/business/business';
import ExpenseConstructor from '@repo/business/finance/expense/expense';
import type { ExpenseEntity } from '@repo/business/finance/expense/types';

import { Service } from '../../../shared';

import { Bill } from '../../../entities/bill.entity';
import { Expense } from '../../../entities/expense.entity';
import { Supplier } from '../../../entities/supplier.entity';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { SupplierService } from './supplier/supplier.service';

export type InitializeParams = {
    value?: number;
    type?: ExpenseEntity['type'];
    month?: ExpenseEntity['month'];
    expense: Expense;
    instalment_number?: number;
}

@Injectable()
export class ExpenseService extends Service<Expense> {
  constructor(
      @InjectRepository(Expense)
      protected repository: Repository<Expense>,
      protected expenseBusiness: ExpenseBusiness,
      protected supplierService: SupplierService,
  ) {
    super('expenses', ['supplier', 'bill'], repository);
  }

    async buildForCreation(bill: Bill, createExpenseDto: CreateExpenseDto) {
        const supplier = await this.supplierService.treatEntityParam<Supplier>(
            createExpenseDto.supplier,
            'Supplier',
        ) as Supplier;
        const name = `${bill.name} ${supplier.name}`;
        return new ExpenseConstructor({
            supplier,
            bill,
            year: bill.year,
            name,
            type: createExpenseDto.type,
            paid: Boolean(createExpenseDto.paid),
            value: createExpenseDto.value,
            month: createExpenseDto.month,
            description: createExpenseDto.description,
            instalment_number: createExpenseDto.instalment_number,
        });
    }

    async initialize({ type, expense, value = 0, month, instalment_number }: InitializeParams) {
        const expenseToInitialize = new ExpenseConstructor({
            ...expense,
            type: type ?? expense.type,
            instalment_number: instalment_number ?? expense.instalment_number,
        })
        const result = this.expenseBusiness.initialize(expenseToInitialize, value, month);
        const initializedExpense = await this.customSave(result.expenseForCurrentYear);
        if(initializedExpense) {
            result.expenseForCurrentYear = initializedExpense;
        }
        return result;
    }

    async addExpenseForNextYear(bill: Bill, months: Array<string> = [], expense: Expense, existingExpense?: Expense) {
        const currentExpenseForNextYear = this.expenseBusiness.reinitialize(
            months,
            expense,
            existingExpense
        );

        return await this.customSave({...currentExpenseForNextYear, bill });
    }

    private async customSave(expense: Expense) {
        const calculatedExpense = this.expenseBusiness.calculate(expense);
        return await this.save(calculatedExpense);
    }
}
