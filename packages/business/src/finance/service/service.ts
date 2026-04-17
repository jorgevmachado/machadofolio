import { type Nest } from '../../api';

import { Bank } from '../bank';
import { Bill } from '../bill';
import { Expense } from '../expense';
import Finance from '../finance';
import { Group } from '../group';
import { Supplier } from '../supplier';
import { SupplierType } from '../supplier-type';
import type { FinanceInfo } from '../types';

export class FinanceService {
    constructor(private nest: Nest) {}

    public async initialize(): Promise<Finance> {
        return this.nest.finance.initialize().then((response) => new Finance(response));
    }

    public async find(): Promise<FinanceInfo> {
        return this.nest.finance.find().then((response) => {
            const { bills, banks, groups, finance, expenses, suppliers, supplierTypes, ...result  } = response;
            return {
                ...result,
                bills: bills.map((bill) => new Bill(bill)),
                banks: banks.map((bank) => new Bank(bank)),
                groups: groups.map((group) => new Group(group)),
                finance: new Finance(finance),
                expenses: expenses.map((expense) => new Expense(expense)),
                suppliers: suppliers.map((supplier) => new Supplier(supplier)),
                supplierTypes: supplierTypes.map((type) => new SupplierType(type)),
            };
        });
    }
}